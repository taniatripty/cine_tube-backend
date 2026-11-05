import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";
import { jwtutils } from "./jwt";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtutils.createtoken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: envVars.ACCESS_TOKEN_EXPIRESIN,
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

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
};

export { getAccessToken, getRefreshToken };