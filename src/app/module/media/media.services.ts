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

export const mediaService = {
  createMovie,
};