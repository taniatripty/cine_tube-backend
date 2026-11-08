import type { Response } from "express";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";
import { cookieUtils } from "./cookie";
import { jwtutils } from "./jwt";

const configuredAccessTokenExpiresIn =
  envVars.ACCESS_TOKEN_EXPIRESIN.trim();
const accessTokenExpiresInPattern =
  /^\d+(?:\.\d+)?\s*(?:ms|milliseconds?|s|seconds?|m|minutes?|h|hours?|d|days?|w|weeks?|y|years?)$/i;
const accessTokenExpiresIn = accessTokenExpiresInPattern.test(
  configuredAccessTokenExpiresIn,
)
  ? configuredAccessTokenExpiresIn
  : "1d";

if (accessTokenExpiresIn !== configuredAccessTokenExpiresIn) {
  console.warn(
    "Invalid ACCESS_TOKEN_EXPIRESIN; using the one-day fallback (1d).",
  );
}



const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtutils.createtoken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: accessTokenExpiresIn,
    } as SignOptions,
  );
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtutils.createtoken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRESIN,
    } as SignOptions,
  );
  return refreshToken;
};
const setAccessToken = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1d
    maxAge: 60 * 60 * 24 * 1000,
  });
}   

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1000 * 7,
  });
};

const setBetterAuthCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1d
    maxAge: 60 * 60 * 24 * 1000,
  });
};




export const tokenUtils = {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshTokenCookie,
  setAccessTokenCookie: setAccessToken,
  setBetterAuthCookie
};
