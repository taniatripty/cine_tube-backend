import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  TCreateReviewInput,
  TModerateReviewInput,
  TSetReviewReactionInput,
  TUpdateReviewInput,
} from "./review.interface";
import { ReviewStatus } from "../../../generated/prisma/enums";

const resolveAdminTagIds = async (payload: {
  tagId?: string;
  tagIds?: string[];
  tags?: string[];
  tagNames?: string[];
}) => {
  const tagIds = Array.from(
    new Set(
      [
        ...(payload.tagId ? [payload.tagId] : []),
        ...(payload.tagIds ?? []),
      ]
        .map((id) => id.trim())
        .filter((id) => id.length > 0),
    ),
  );

  const tagNames = Array.from(
    new Set(
      [...(payload.tags ?? []), ...(payload.tagNames ?? [])]
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  );

  const resolvedTagIds: string[] = [];

  if (tagIds.length > 0) {
    const existingTagsById = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });

    if (existingTagsById.length !== tagIds.length) {
      throw new AppError(
        status.NOT_FOUND,
        "One or more tags not found. Tags must be created by an admin.",
      );
    }

    resolvedTagIds.push(...existingTagsById.map((tag) => tag.id));
  }

  if (tagNames.length > 0) {
    const existingTagsByName = await prisma.tag.findMany({
      where: { name: { in: tagNames } },
      select: { id: true },
    });

    if (existingTagsByName.length !== tagNames.length) {
      throw new AppError(
        status.NOT_FOUND,
        "One or more tags not found. Tags must be created by an admin.",
      );
    }

    resolvedTagIds.push(...existingTagsByName.map((tag) => tag.id));
  }

  return Array.from(new Set(resolvedTagIds));
};

const reviewDetailsInclude = {
  media: {
    select: {
      id: true,
      title: true,
      synopsis: true,
      poster: true,
      backdrop: true,
      type: true,
      releaseYear: true,
      averageRating: true,
      reviewCount: true,
      reactionCount: true,
    },
  },
  tags: true,
  reviewLikes: true,
  comments: {
    include: {
      commentLikes: true,
      _count: {
        select: {
          commentLikes: true,
          replies: true,
        },
      },
    },
  },
  _count: {
    select: {
      reviewLikes: true,
      comments: true,
    },
  },
};

const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      ...reviewDetailsInclude,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMyReviews = async (user: IRequest) => {
  return prisma.review.findMany({
    where: {
      userId: user.userId,
    },
    include: reviewDetailsInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createReview = async (user: IRequest, payload: TCreateReviewInput) => {
  const media = await prisma.media.findFirst({
    where: {
      id: payload.mediaId,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found.");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_mediaId: {
        userId: user.userId,
        mediaId: media.id,
      },
    },
    select: { id: true },
  });

  if (existingReview) {
    throw new AppError(status.CONFLICT, "You have already reviewed this media.");
  }

  const resolvedTagIds = await resolveAdminTagIds(payload);

  return prisma.$transaction(async (transaction) => {
    const review = await transaction.review.create({
      data: {
        userId: user.userId,
        mediaId: media.id,
        rating: payload.rating,
        content: payload.content,
        isSpoiler: payload.isSpoiler ?? false,
        ...(resolvedTagIds.length > 0
          ? {
              tags: {
                connect: resolvedTagIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        tags: true,
      },
    });

    const reviewAggregate = await transaction.review.aggregate({
      where: { mediaId: media.id },
      _avg: { rating: true },
      _count: { _all: true, rating: true },
    });

    const updatedMedia = await transaction.media.update({
      where: { id: media.id },
      data: {
        reviewCount: reviewAggregate._count._all,
        ratingCount: reviewAggregate._count.rating,
        averageRating: reviewAggregate._avg.rating ?? 0,
      },
    });

    return { ...review, media: updatedMedia };
  });
};

const moderateReview = async (
  user: IRequest,
  reviewId: string,
  payload: TModerateReviewInput,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found.");
  }

  return prisma.review.update({
    where: { id: review.id },
    data: {
      status: payload.status,
      moderator: { connect: { id: user.userId } },
      moderatedAt: new Date(),
      ...(payload.moderationNote !== undefined
        ? { moderationNote: payload.moderationNote }
        : {}),
    },
    include: {
      moderator: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

const setReviewReaction = async (
  user: IRequest,
  reviewId: string,
  payload: TSetReviewReactionInput,
) => {
  return prisma.$transaction(async (transaction) => {
    const review = await transaction.review.findUnique({
      where: { id: reviewId },
      select: { id: true, mediaId: true },
    });

    if (!review) {
      throw new AppError(status.NOT_FOUND, "Review not found.");
    }

    const reaction = await transaction.reviewLike.upsert({
      where: {
        userId_reviewId: {
          userId: user.userId,
          reviewId: review.id,
        },
      },
      create: {
        userId: user.userId,
        reviewId: review.id,
        type: payload.type,
      },
      update: { type: payload.type },
    });

    const reactionCounts = await transaction.reviewLike.groupBy({
      by: ["type"],
      where: { reviewId: review.id },
      _count: { _all: true },
    });

    const reactionCountMap = reactionCounts.reduce(
      (acc, curr) => {
        acc[curr.type] = curr._count._all;
        acc.total += curr._count._all;
        return acc;
      },
      {
        LIKE: 0,
        DISLIKE: 0,
        LOVE: 0,
        LAUGH: 0,
        WOW: 0,
        SAD: 0,
        ANGRY: 0,
        total: 0,
      } as Record<string, number>,
    );

    const updatedReview = await transaction.review.update({
      where: { id: review.id },
      data: {
        likeCount: reactionCountMap.LIKE,
        dislikeCount: reactionCountMap.DISLIKE,
        loveCount: reactionCountMap.LOVE,
        laughCount: reactionCountMap.LAUGH,
        wowCount: reactionCountMap.WOW,
        sadCount: reactionCountMap.SAD,
        angryCount: reactionCountMap.ANGRY,
        reactionCount: reactionCountMap.total,
      },
      include: {
        _count: {
          select: {
            reviewLikes: true,
            comments: true,
          },
        },
      },
    });

    const totalMediaReactions = await transaction.reviewLike.count({
      where: {
        review: {
          mediaId: review.mediaId,
        },
      },
    });

    await transaction.media.update({
      where: { id: review.mediaId },
      data: {
        reactionCount: totalMediaReactions,
      },
    });

    return { reaction, reactionCounts, review: updatedReview };
  });
};

const removeReviewReaction = async (user: IRequest, reviewId: string) => {
  return prisma.$transaction(async (transaction) => {
    const review = await transaction.review.findUnique({
      where: { id: reviewId },
      select: { id: true, mediaId: true },
    });

    if (!review) {
      throw new AppError(status.NOT_FOUND, "Review not found.");
    }

    await transaction.reviewLike.deleteMany({
      where: { userId: user.userId, reviewId: review.id },
    });

    const reactionCounts = await transaction.reviewLike.groupBy({
      by: ["type"],
      where: { reviewId: review.id },
      _count: { _all: true },
    });

    const reactionCountMap = reactionCounts.reduce(
      (acc, curr) => {
        acc[curr.type] = curr._count._all;
        acc.total += curr._count._all;
        return acc;
      },
      {
        LIKE: 0,
        DISLIKE: 0,
        LOVE: 0,
        LAUGH: 0,
        WOW: 0,
        SAD: 0,
        ANGRY: 0,
        total: 0,
      } as Record<string, number>,
    );

    const updatedReview = await transaction.review.update({
      where: { id: review.id },
      data: {
        likeCount: reactionCountMap.LIKE,
        dislikeCount: reactionCountMap.DISLIKE,
        loveCount: reactionCountMap.LOVE,
        laughCount: reactionCountMap.LAUGH,
        wowCount: reactionCountMap.WOW,
        sadCount: reactionCountMap.SAD,
        angryCount: reactionCountMap.ANGRY,
        reactionCount: reactionCountMap.total,
      },
      include: {
        _count: {
          select: {
            reviewLikes: true,
            comments: true,
          },
        },
      },
    });

    const totalMediaReactions = await transaction.reviewLike.count({
      where: {
        review: {
          mediaId: review.mediaId,
        },
      },
    });

    await transaction.media.update({
      where: { id: review.mediaId },
      data: {
        reactionCount: totalMediaReactions,
      },
    });

    return { reaction: null, reactionCounts, review: updatedReview };
  });
};

const updateReview = async (
  user: IRequest,
  reviewId: string,
  payload: TUpdateReviewInput,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true, status: true, mediaId: true },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found.");
  }

  if (review.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You can only edit your own reviews.");
  }

  if (review.status !== ReviewStatus.PENDING) {
    throw new AppError(
      status.FORBIDDEN,
      "Only PENDING reviews can be edited.",
    );
  }

  const hasTagUpdate =
    payload.tagId !== undefined ||
    payload.tagIds !== undefined ||
    payload.tags !== undefined ||
    payload.tagNames !== undefined;

  const finalTagIds = hasTagUpdate ? await resolveAdminTagIds(payload) : [];

  return prisma.$transaction(async (transaction) => {
    const updatedReview = await transaction.review.update({
      where: { id: review.id },
      data: {
        ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
        ...(payload.content !== undefined ? { content: payload.content } : {}),
        ...(payload.isSpoiler !== undefined ? { isSpoiler: payload.isSpoiler } : {}),
        ...(hasTagUpdate
          ? {
              tags: {
                set: finalTagIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        tags: true,
        reviewLikes: true,
        comments: {
          include: {
            commentLikes: true,
            _count: {
              select: {
                commentLikes: true,
                replies: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviewLikes: true,
            comments: true,
          },
        },
      },
    });

    if (payload.rating !== undefined) {
      const reviewAggregate = await transaction.review.aggregate({
        where: { mediaId: review.mediaId },
        _avg: { rating: true },
        _count: { _all: true, rating: true },
      });

      await transaction.media.update({
        where: { id: review.mediaId },
        data: {
          averageRating: reviewAggregate._avg.rating ?? 0,
          ratingCount: reviewAggregate._count.rating,
        },
      });
    }

    return updatedReview;
  });
};

const deleteReview = async (user: IRequest, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true, status: true, mediaId: true },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found.");
  }

  if (review.userId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You can only delete your own reviews.",
    );
  }

  if (review.status !== ReviewStatus.PENDING) {
    throw new AppError(
      status.FORBIDDEN,
      "Only PENDING reviews can be deleted.",
    );
  }

  return prisma.$transaction(async (transaction) => {
    await transaction.review.delete({ where: { id: review.id } });

    const reviewAggregate = await transaction.review.aggregate({
      where: { mediaId: review.mediaId },
      _avg: { rating: true },
      _count: { _all: true, rating: true },
    });

    const totalMediaReactions = await transaction.reviewLike.count({
      where: {
        review: {
          mediaId: review.mediaId,
        },
      },
    });

    await transaction.media.update({
      where: { id: review.mediaId },
      data: {
        reviewCount: reviewAggregate._count._all,
        ratingCount: reviewAggregate._count.rating,
        averageRating: reviewAggregate._avg.rating ?? 0,
        reactionCount: totalMediaReactions,
      },
    });

    return { id: review.id };
  });
};

export const reviewService = {
  getAllReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  moderateReview,
  setReviewReaction,
  removeReviewReaction,
};