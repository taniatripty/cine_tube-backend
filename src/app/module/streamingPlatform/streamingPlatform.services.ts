import { prisma } from "../../lib/prisma";
import { TCreateStreamingPlatformInput } from "./streamingPlatform.interface";

const createStreamingPlatform = async (
  payload: TCreateStreamingPlatformInput,
) => {
  return prisma.streamingPlatform.create({
    data: payload,
  });
};

export const streamingPlatformService = {
  createStreamingPlatform,
};