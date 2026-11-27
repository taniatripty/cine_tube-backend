import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from "./user.services";

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    ...(req.file?.path ? { image: req.file.path } : {}),
  };

  const data = await userService.updateProfile(req.user, payload);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Profile updated successfully.",
    data,
  });
});

export const userController = {
  updateProfile,
};
