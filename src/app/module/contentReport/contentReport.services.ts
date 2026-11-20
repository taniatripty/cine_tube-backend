import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { TCreateContentReportInput } from "./contentReport.interface";

const createContentReport = async (
  user: IRequest,
  payload: TCreateContentReportInput,
) => {
  if (payload.targetType === "REVIEW") {
    const review = await prisma.review.findUnique({
      where: { id: payload.reviewId },
      select: { id: true },
    });

    if (!review) {
      throw new AppError(status.NOT_FOUND, "Review not found.");
    }

    return prisma.contentReport.create({
      data: {
        reporterId: user.userId,
        targetType: payload.targetType,
        reviewId: review.id,
        reason: payload.reason,
        description: payload.description,
      },
    });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: payload.commentId },
    select: { id: true },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found.");
  }

  return prisma.contentReport.create({
    data: {
      reporterId: user.userId,
      targetType: payload.targetType,
      commentId: comment.id,
      reason: payload.reason,
      description: payload.description,
    },
  });
};

export const contentReportService = {
  createContentReport,
};