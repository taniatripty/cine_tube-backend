import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { mediaService } from "./media.services";

const createMovie = catchAsync(
  async (req: Request, res: Response) => {
    const data = await mediaService.createMovie(req.body);

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Movie created successfully.",
      data,
    });
  },
);

export const mediaController = {
  createMovie,
};