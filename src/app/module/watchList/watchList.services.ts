import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { prisma } from "../../lib/prisma";
import { IRequest } from "../../interface/requestUser.interface";
import { TCreateWatchListInput } from "./watchlist.interface";


const createWatchList = async (
  user: IRequest,
  payload: TCreateWatchListInput,
) => {
  const media = payload.mediaId
    ? await prisma.media.findFirst({
        where: {
          id: payload.mediaId,
          isDeleted: false,
        },
      })
    : await prisma.media.findFirst({
        where: {
          title: payload.title,
          isDeleted: false,
        },
      });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found.");
  }

  const existing = await prisma.watchList.findUnique({
    where: {
      userId_mediaId: {
        userId: user.userId,
        mediaId: media.id,
      },
    },
  });

  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "This media is already in the watchlist.",
    );
  }

  return prisma.watchList.create({
    data: {
      userId: user.userId,
      mediaId: media.id,
    },
    include: {
      media: true,
    },
  });
};

export const watchListService = {
  createWatchList,
};