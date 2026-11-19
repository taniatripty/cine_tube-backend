import { prisma } from "../../lib/prisma";
import { TCreateTagInput } from "./tag.interface";

const createTag = async (payload: TCreateTagInput) => {
  return prisma.tag.create({
    data: payload,
  });
};

export const tagService = {
  createTag,
};