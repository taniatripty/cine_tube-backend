import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { seasonService } from "./season.services";

const createSeason = catchAsync(async (req: Request, res: Response) => {
  const data = await seasonService.createSeason(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Season created successfully.",
    data,
  });
});

export const seasonController = {
  createSeason,
};