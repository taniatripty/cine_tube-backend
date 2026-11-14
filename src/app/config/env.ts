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
  FRONTEND_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  EMAIL_SENDER_SMTP_USER: string;
  EMAIL_SENDER_SMTP_PASS: string;
  EMAIL_SENDER_SMTP_HOST: string;
  EMAIL_SENDER_SMTP_PORT: string;
  EMAIL_SENDER_SMTP_FROM: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  CLOUDINARY_CLOUD_NAME:string;
  CLOUDINARY_API_KEY:string;
  CLOUDINARY_API_SECRET:string;
  
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
    "FRONTEND_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ] as const;

  for (const name of requiredVariables) {
    const envName = name.trim();
    if (!process.env[envName]?.trim()) {
      throw new Error(
        `Environment variable ${envName} is required but is not set.`,
      );
    }
  }

 
  return {
    NODE_ENV: process.env.NODE_ENV  as string,
    PORT: process.env.PORT  as string,
    DATABASE_URL: process.env.DATABASE_URL  as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET  as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL  as string,
    ACCESS_TOKEN_SECRET:  process.env.ACCESS_TOKEN_SECRET  as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET  as string,
    ACCESS_TOKEN_EXPIRESIN: process.env.ACCESS_TOKEN_EXPIRESIN as string,
    REFRESH_TOKEN_EXPIRESIN: process.env.REFRESH_TOKEN_EXPIRESIN  as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIESIN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIESIN  as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE  as string,
    FRONTEND_URL:process.env.FRONTEND_URL as string,
    GOOGLE_CLIENT_ID:process.env.GoOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET as string,
    EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
    EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
    EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
    EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
    EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET as string
  };
};

export const envVars = loadEnvVariables();