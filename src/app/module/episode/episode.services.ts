import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { prisma } from "../../lib/prisma";
import { TCreateEpisodeInput } from "./episode.interface";

const createEpisode = async (payload: TCreateEpisodeInput) => {
  const season = await prisma.season.findUnique({
    where: { id: payload.seasonId },
    select: { id: true },
  });

  if (!season) {
    throw new AppError(status.NOT_FOUND, "Season not found.");
  }

  return prisma.episode.create({
    data: {
      ...payload,
      seasonId: season.id,
    },
  });
};

export const episodeService = {
  createEpisode,
};