import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  TCreateCommentInput,
  TModerateCommentInput,
  TSetCommentReactionInput,
  TUpdateCommentInput,
} from "./comment.interface";
import { CommentStatus } from "../../../generated/prisma/enums";

const createComment = async (
  user: IRequest,
  payload: TCreateCommentInput,
) => {
  const review = await prisma.review.findUnique({
    where: { id: payload.reviewId },
    select: { id: true },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found.");
  }

  if (payload.parentId) {
    const parentComment = await prisma.comment.findFirst({
      where: {
        id: payload.parentId,
        reviewId: review.id,
      },
      select: { id: true },
    });

    if (!parentComment) {
      throw new AppError(
        status.NOT_FOUND,
        "Parent comment not found for this review.",
      );
    }
  }

  return prisma.$transaction(async (transaction) => {
    const comment = await transaction.comment.create({
      data: {
        userId: user.userId,
        reviewId: review.id,
        parentId: payload.parentId,
        content: payload.content,
      },
    });

    await transaction.review.update({
      where: { id: review.id },
      data: {
        commentCount: { increment: 1 },
      },
    });

    if (payload.parentId) {
      await transaction.comment.update({
        where: { id: payload.parentId },
        data: {
          replyCount: { increment: 1 },
        },
      });
    }

    return comment;
  });
};

const moderateComment = async (
  user: IRequest,
  commentId: string,
  payload: TModerateCommentInput,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found.");
  }

  return prisma.comment.update({
    where: { id: comment.id },
    data: {
      status: payload.status,
      moderatedBy: { connect: { id: user.userId } },
      moderatedAt: new Date(),
    },
    include: {
      moderatedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

const setCommentReaction = async (
  user: IRequest,
  commentId: string,
  payload: TSetCommentReactionInput,
) => {
  return prisma.$transaction(async (transaction) => {
    const comment = await transaction.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      throw new AppError(status.NOT_FOUND, "Comment not found.");
    }

    const reaction = await transaction.commentLike.upsert({
      where: {
        userId_commentId: {
          userId: user.userId,
          commentId: comment.id,
        },
      },
      create: {
        userId: user.userId,
        commentId: comment.id,
        type: payload.type,
      },
      update: { type: payload.type },
    });

    const reactionCounts = await transaction.commentLike.groupBy({
      by: ["type"],
      where: { commentId: comment.id },
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

    const updatedComment = await transaction.comment.update({
      where: { id: comment.id },
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
            commentLikes: true,
            replies: true,
          },
        },
      },
    });

    return { reaction, reactionCounts, comment: updatedComment };
  });
};

const removeCommentReaction = async (user: IRequest, commentId: string) => {
  return prisma.$transaction(async (transaction) => {
    const comment = await transaction.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      throw new AppError(status.NOT_FOUND, "Comment not found.");
    }

    await transaction.commentLike.deleteMany({
      where: { userId: user.userId, commentId: comment.id },
    });

    const reactionCounts = await transaction.commentLike.groupBy({
      by: ["type"],
      where: { commentId: comment.id },
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

    const updatedComment = await transaction.comment.update({
      where: { id: comment.id },
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
            commentLikes: true,
            replies: true,
          },
        },
      },
    });

    return { reaction: null, reactionCounts, comment: updatedComment };
  });
};

const updateComment = async (
  user: IRequest,
  commentId: string,
  payload: TUpdateCommentInput,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true, status: true },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found.");
  }

  if (comment.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You can only edit your own comments.");
  }

  if (comment.status !== CommentStatus.PENDING) {
    throw new AppError(status.FORBIDDEN, "Only PENDING comments can be edited.");
  }

  return prisma.comment.update({
    where: { id: comment.id },
    data: {
      content: payload.content,
    },
    include: {
      commentLikes: true,
      _count: {
        select: {
          commentLikes: true,
          replies: true,
        },
      },
    },
  });
};

const deleteComment = async (user: IRequest, commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true, status: true, reviewId: true, parentId: true },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found.");
  }

  if (comment.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You can only delete your own comments.");
  }

  if (comment.status !== CommentStatus.PENDING) {
    throw new AppError(status.FORBIDDEN, "Only PENDING comments can be deleted.");
  }

  return prisma.$transaction(async (transaction) => {
    await transaction.comment.delete({ where: { id: comment.id } });

    await transaction.review.update({
      where: { id: comment.reviewId },
      data: {
        commentCount: { decrement: 1 },
      },
    });

    if (comment.parentId) {
      await transaction.comment.update({
        where: { id: comment.parentId },
        data: {
          replyCount: { decrement: 1 },
        },
      });
    }

    return { id: comment.id };
  });
};

export const commentService = {
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
  setCommentReaction,
  removeCommentReaction,
};