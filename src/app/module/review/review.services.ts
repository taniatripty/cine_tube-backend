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

export const reviewService = {
  createReview,
};