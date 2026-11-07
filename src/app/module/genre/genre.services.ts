import { prisma } from "../../lib/prisma";
import { TCreateGenreInput } from "./genre.interface";

const createGenre = async (payload: TCreateGenreInput) => {
   const result=prisma.genre.create({
    data: payload,
  });
  return result;
};

const getAllGenres = async () => {
  return prisma.genre.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const genreService = {
  createGenre,
  getAllGenres,
};