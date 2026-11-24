import { prisma } from "../../lib/prisma";
import { TCreateTagInput } from "./tag.interface";

const createTag = async (payload: TCreateTagInput) => {
  return prisma.tag.create({
    data: payload,
  });
};

const getAllTags = async () => {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });
};

export const tagService = {
  createTag,
  getAllTags,
};