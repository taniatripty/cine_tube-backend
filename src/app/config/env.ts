import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRESIN: string;
  REFRESH_TOKEN_EXPIRESIN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIESIN: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRESIN",
    "REFRESH_TOKEN_EXPIRESIN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIESIN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
  ] as const;

  for (const name of requiredVariables) {
    if (!process.env[name]) {
      throw new Error(
        `Environment variable ${name} is required but is not set.`,
      );
    }
  }

  const get = (name: (typeof requiredVariables)[number]): string =>
    process.env[name]!;

  return {
    NODE_ENV: get("NODE_ENV"),
    PORT: get("PORT"),
    DATABASE_URL: get("DATABASE_URL"),
    BETTER_AUTH_SECRET: get("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: get("BETTER_AUTH_URL"),
    ACCESS_TOKEN_SECRET: get("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: get("REFRESH_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRESIN: get("ACCESS_TOKEN_EXPIRESIN"),
    REFRESH_TOKEN_EXPIRESIN: get("REFRESH_TOKEN_EXPIRESIN"),
    BETTER_AUTH_SESSION_TOKEN_EXPIESIN: get(
      "BETTER_AUTH_SESSION_TOKEN_EXPIESIN",
    ),
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: get(
      "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    ),
  };
};

export const envVars = loadEnvVariables();