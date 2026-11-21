import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { watchListService } from "./watchList.services";



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

const getMyWatchList = catchAsync(async (req: Request, res: Response) => {
  const data = await watchListService.getMyWatchList(req.user);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Watchlist retrieved successfully.",
    data,
  });
});

const deleteWatchListItem = catchAsync(async (req: Request, res: Response) => {
  const data = await watchListService.deleteWatchListItem(
    req.user,
    req.params.mediaId as string,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Media removed from watchlist successfully.",
    data,
  });
});

export const watchListController = {
  createWatchList,
  getMyWatchList,
  deleteWatchListItem,
};