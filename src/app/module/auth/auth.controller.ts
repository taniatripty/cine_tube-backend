import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.services";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHandler/AppError";
import status from "http-status";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";

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

const forgetpassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgetPassword(email);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: " forget password successfully",
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.logoutUser(betterAuthSessionToken);
  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect as string  || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirects", {
    callbackURL: callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
});



const googleloginSuccess = catchAsync(
    async (req: Request, res: Response) => {
        const redirectPath =
            typeof req.query.redirect === "string"
                ? req.query.redirect
                : "/dashboard";

        const sessionToken = req.cookies["better-auth.session_token"];

        // No session token
        if (!sessionToken) {
            return res.redirect(
                `${envVars.FRONTEND_URL}/login?error=oauth_failed`
            );
        }

        // Get Better Auth session
        const session = await auth.api.getSession({
            headers: {
                cookie: `better-auth.session_token=${sessionToken}`,
            },
        });

        // No session/user
        if (!session?.user) {
            return res.redirect(
                `${envVars.FRONTEND_URL}/login?error=no_user_found`
            );
        }

        // Generate application JWT tokens
        const result = await authService.googleLoginSuccess(session);

        const { accessToken, refreshToken } = result;

        // Set cookies
        tokenUtils.setAccessToken(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);

        // Prevent open redirect
        const isValidRedirectPath =
            redirectPath.startsWith("/") &&
            !redirectPath.startsWith("//");

        const finalRedirectPath = isValidRedirectPath
            ? redirectPath
            : "/dashboard";

        // Redirect frontend
        return res.redirect(
            `${envVars.FRONTEND_URL}${finalRedirectPath}`
        );
    }
);

export const authcontroller={
  register,
  login,
  getAllUsers,
  getMe,
  getnewRefreshToken,
  forgetpassword,
  logoutUser,
  googleLogin,
  googleloginSuccess
};