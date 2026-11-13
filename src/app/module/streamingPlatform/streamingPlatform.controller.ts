import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { streamingPlatformService } from "./streamingPlatform.services";

const createStreamingPlatform = catchAsync(
  async (req: Request, res: Response) => {
    const data = await streamingPlatformService.createStreamingPlatform(
      req.body,
    );

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Streaming platform created successfully.",
      data,
    });
  },
);

const getAllStreamingPlatforms = catchAsync(
  async (_req: Request, res: Response) => {
    const data = await streamingPlatformService.getAllStreamingPlatforms();

    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Streaming platforms retrieved successfully.",
      data,
    });
  },
);

export const streamingPlatformController = {
  createStreamingPlatform,
  getAllStreamingPlatforms,
};