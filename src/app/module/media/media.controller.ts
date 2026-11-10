import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { mediaService } from "./media.services";

const createMedia = catchAsync(
  async (req: Request, res: Response) => {
    const data = await mediaService.createMedia(req.body);

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Media created successfully.",
      data,
    });
  },
);

const getAllMedia = catchAsync(async (_req: Request, res: Response) => {
  const data = await mediaService.getAllMedia();

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Media retrieved successfully.",
    data,
  });
});

const getMediaById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await mediaService.getMediaById(id as string);

  if (!data) {
    sendResponse({
      res,
      statusCode: 404,
      success: false,
      message: "Media not found.",
    });
    return;
  }

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Media retrieved successfully.",
    data,
  });
});

export const mediaController = {
  createMedia,
  getAllMedia,
  getMediaById,
};