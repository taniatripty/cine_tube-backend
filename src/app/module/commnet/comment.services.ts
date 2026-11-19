import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { TCreateCommentInput } from "./comment.interface";

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

export const commentService = {
  createComment,
};