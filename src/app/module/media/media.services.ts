import { prisma } from "../../lib/prisma";
import { TCreateMediaInput } from "./media.interface";

const createMedia = async (payload: TCreateMediaInput) => {
  const { genreIds, ...mediaData } = payload;

  return prisma.media.create({
    data: {
      ...mediaData,
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
  createMedia,
  getAllMedia,
  getMediaById,
};