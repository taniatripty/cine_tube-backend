import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { episodeService } from "./episode.services";

const createEpisode = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    thumbnail: req.file?.path 
  };
  const data = await episodeService.createEpisode(payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Episode created successfully.",
    data,
  });
});

export const episodeController = {
  createEpisode,
};