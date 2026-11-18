import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { watchListService } from "./watchlist.services";


const createWatchList = catchAsync(async (req: Request, res: Response) => {
  const data = await watchListService.createWatchList(req.user, req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Media added to watchlist successfully.",
    data,
  });
});

export const watchListController = {
  createWatchList,
};