import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHandler/AppError";
import { TCreateMediaInput } from "./media.interface";

const createMedia = async (payload: TCreateMediaInput) => {
  const { genreIds, credits, availabilities, ...mediaData } = payload;

  return prisma.$transaction(async (transaction) => {
    if (genreIds?.length) {
      const genres = await transaction.genre.findMany({
        where: { id: { in: genreIds }, isDeleted: false },
        select: { id: true },
      });
      if (genres.length !== genreIds.length) {
        throw new AppError(
          status.NOT_FOUND,
          "One or more genres were not found or are deleted.",
        );
      }
    }

    if (credits?.length) {
      const personIds = [...new Set(credits.map(({ personId }) => personId))];
      const people = await transaction.person.findMany({
        where: { id: { in: personIds }, isDeleted: false },
        select: { id: true },
      });
      if (people.length !== personIds.length) {
        throw new AppError(
          status.NOT_FOUND,
          "One or more credited people were not found or are deleted.",
        );
      }
    }

    if (availabilities?.length) {
      const platformIds = [
        ...new Set(availabilities.map(({ platformId }) => platformId)),
      ];
      const platforms = await transaction.streamingPlatform.findMany({
        where: { id: { in: platformIds } },
        select: { id: true },
      });
      if (platforms.length !== platformIds.length) {
        throw new AppError(
          status.NOT_FOUND,
          "One or more streaming platforms were not found.",
        );
      }
    }

    return transaction.media.create({
      data: {
        ...mediaData,
        ...(genreIds?.length
          ? { genres: { connect: genreIds.map((id) => ({ id })) } }
          : {}),
        ...(credits?.length
          ? {
              credits: {
                create: credits.map(({ personId, ...credit }) => ({
                  ...credit,
                  person: { connect: { id: personId } },
                })),
              },
            }
          : {}),
        ...(availabilities?.length
          ? {
              mediaAvailabilities: {
                create: availabilities.map(
                  ({ platformId, ...availability }) => ({
                    ...availability,
                    Platform: { connect: { id: platformId } },
                  }),
                ),
              },
            }
          : {}),
      },
      include: {
        genres: true,
        credits: { include: { person: true } },
        mediaAvailabilities: { include: { Platform: true } },
      },
    });
  });
};

const getAllMedia = async () => {
  const result=prisma.media.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      genres: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getMediaById = async (id: string) => {
  const result=prisma.media.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      genres: true,
    },
  });
  return result;
};

export const mediaService = {
  createMedia,
  getAllMedia,
  getMediaById,
};