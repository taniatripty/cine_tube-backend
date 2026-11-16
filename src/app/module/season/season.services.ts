import status from "http-status";
import { MediaType } from "../../../generated/prisma/enums";
import AppError from "../../errorHandler/AppError";
import { prisma } from "../../lib/prisma";
import { TCreateSeasonInput } from "./season.interface";

const createSeason = async (payload: TCreateSeasonInput) => {
  const series = await prisma.media.findFirst({
    where: {
      id: payload.mediaId,
      type: MediaType.SERIES,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!series) {
    throw new AppError(status.NOT_FOUND, "Series not found.");
  }

  return prisma.season.create({
    data: {
      mediaId: series.id,
      seasonNumber: payload.seasonNumber,
      title: payload.title,
    },
  });
};

export const seasonService = {
  createSeason,
};