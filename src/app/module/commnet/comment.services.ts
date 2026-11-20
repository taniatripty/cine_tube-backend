import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  TCreateCommentInput,
  TModerateCommentInput,
} from "./comment.interface";

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

  return prisma.comment.create({
    data: {
      userId: user.userId,
      reviewId: review.id,
      parentId: payload.parentId,
      content: payload.content,
    },
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

export const commentService = {
  createComment,
  moderateComment,
};