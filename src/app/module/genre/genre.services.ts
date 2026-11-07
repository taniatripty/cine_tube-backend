import { prisma } from "../../lib/prisma";
import { TCreateGenreInput } from "./genre.interface";

const createGenre = async (payload: TCreateGenreInput) => {
   const result=prisma.genre.create({
    data: payload,
  });
  return result;
};

export const genreService = {
  createGenre,
};