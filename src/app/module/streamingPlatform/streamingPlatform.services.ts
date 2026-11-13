import { prisma } from "../../lib/prisma";
import { TCreateStreamingPlatformInput } from "./streamingPlatform.interface";

const createStreamingPlatform = async (
  payload: TCreateStreamingPlatformInput,
) => {
  return prisma.streamingPlatform.create({
    data: payload,
  });
};

const getAllStreamingPlatforms = async () => {
  return prisma.streamingPlatform.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const streamingPlatformService = {
  createStreamingPlatform,
  getAllStreamingPlatforms,
};