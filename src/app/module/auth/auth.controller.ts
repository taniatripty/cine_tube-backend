import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.services";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHandler/AppError";
import status from "http-status";

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

const getnewRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken || !betterAuthSessionToken) {
    throw new AppError(
      status.UNAUTHORIZED,
      !refreshToken
        ? "Refresh token cookie is missing"
        : "Session token cookie is missing",
    );
  }
  const result = await authService.getnewRefreshToken(
    refreshToken,
    betterAuthSessionToken,
  );
  const { accessToken, refreshToken: newrefreshToken, sessionToken } = result;
  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newrefreshToken);
  tokenUtils.setBetterAuthCookie(res, sessionToken);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newrefreshToken,
      sessionToken,
    },
  });
};

export const authcontroller={
  register,
  login,
  getAllUsers,
  getMe,
  getnewRefreshToken
};