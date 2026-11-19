import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { TCreateReviewInput } from "./review.interface";

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

  return prisma.review.create({
    data: {
      userId: user.userId,
      mediaId: media.id,
      rating: payload.rating,
      content: payload.content,
      isSpoiler: payload.isSpoiler ?? false,
    },
    include: {
      media: true,
    },
  });
};

export const reviewService = {
  createReview,
};