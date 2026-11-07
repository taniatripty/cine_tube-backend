import { prisma } from "../../lib/prisma";
import { TCreateGenreInput } from "./genre.interface";

const createGenre = async (payload: TCreateGenreInput) => {
  return prisma.genre.create({
    data: payload,
  });
};

export const genreService = {
  createGenre,
};