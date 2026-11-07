import { MediaType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateMovieInput } from "./media.interface";

const createMovie = async (payload: TCreateMovieInput) => {
  const { genreIds, ...movieData } = payload;

  return prisma.media.create({
    data: {
      ...movieData,
      type: MediaType.MOVIE,
      ...(genreIds?.length
        ? { genres: { connect: genreIds.map((id) => ({ id })) } }
        : {}),
    },
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
  createMovie,
  getAllMedia,
  getMediaById,
};