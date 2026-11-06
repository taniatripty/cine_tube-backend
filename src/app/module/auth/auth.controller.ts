import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.services";
import { tokenUtils } from "../../utils/token";

 const register = catchAsync(
  async (req: Request, res: Response) => {
    const data = await authService.registerUser(req.body);

    const { accessToken, refreshToken, token, ...rest } = data;
  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthCookie(res, token as string);

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Registration successful.",
      data:{
        token,
        accessToken,
        refreshToken,
        ...rest
      },
    });
  },
);

 const login = catchAsync(
  async (req: Request, res: Response) => {
    const data = await authService.loginUser(req.body);
    const { accessToken, refreshToken, token, ...rest } = data;

    tokenUtils.setAccessToken(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthCookie(res, token);

    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Login successful.",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  },
);

 const getAllUsers = catchAsync(
  async (_req: Request, res: Response) => {
    const data = await authService.getAllUsers();

    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully.",
      data,
    });
  },
);

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.getMe(req.user);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User profile fetched successfully.",
    data: result,
  });
});

export const authcontroller={
  register,
  login,
  getAllUsers,
  getMe,
};