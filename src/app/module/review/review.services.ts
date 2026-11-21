import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  TCreateReviewInput,
  TModerateReviewInput,
  TSetReviewReactionInput,
} from "./review.interface";

const getMyReviews = async (user: IRequest) => {
  return prisma.review.findMany({
    where: {
      userId: user.userId,
    },
    include: {
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
        },
      },
      reviewLikes: true,
      comments: {
        include: {
          commentLikes: true,
        },
      },
    },
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

  return prisma.$transaction(async (transaction) => {
    const review = await transaction.review.create({
      data: {
        userId: user.userId,
        mediaId: media.id,
        rating: payload.rating,
        content: payload.content,
        isSpoiler: payload.isSpoiler ?? false,
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
      select: { id: true },
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

    return { reaction, reactionCounts };
  });
};

const removeReviewReaction = async (user: IRequest, reviewId: string) => {
  return prisma.$transaction(async (transaction) => {
    const review = await transaction.review.findUnique({
      where: { id: reviewId },
      select: { id: true },
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

    return { reaction: null, reactionCounts };
  });
};

export const reviewService = {
  getMyReviews,
  createReview,
  moderateReview,
  setReviewReaction,
  removeReviewReaction,
};