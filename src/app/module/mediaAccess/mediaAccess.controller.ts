import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MediaAccessService } from "./mediaAccess.services";

const getMyAccess = catchAsync(async (req: Request, res: Response) => {
  const data = await MediaAccessService.getMyAccess(req.user);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Media access retrieved successfully.",
    data,
  });
});

const checkMyAccess = catchAsync(async (req: Request, res: Response) => {
  const data = await MediaAccessService.checkMyMediaAccess(
    req.user,
    req.params.mediaId as string,
  );

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Media access checked successfully.",
    data,
  });
});

const revokeAccess = catchAsync(async (req: Request, res: Response) => {
  const data = await MediaAccessService.revokeAccess(
    req.params.accessId as string,
  );

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Media access revoked successfully.",
    data,
  });
});

export const MediaAccessController = {
  getMyAccess,
  checkMyAccess,
  revokeAccess,
};