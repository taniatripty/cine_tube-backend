import { Request, Response, RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.services";

export const register: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const data = await authService.registerUser(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Registration successful.",
    data,
  });
});