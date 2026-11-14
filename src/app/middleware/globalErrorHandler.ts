import { ErrorRequestHandler } from "express";
import status from "http-status";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client";
import { TErrorResponse } from "../interface/error.interface";
import AppError from "../errorHandler/AppError";
import {
  handlePrismaClientKnownRequestError,
  handlePrismaClientUnknownError,
  handlePrismaClientValidationError,
  handlerPrismaClientInitializationError,
  handlerPrismaClientRustPanicError,
} from "../errorHandler/handlerPrismaError";
import { handleZodError } from "../errorHandler/handlerZodError";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utils/deleteUploadFileFromGlobalError";

const getErrorResponse = (error: unknown): TErrorResponse => {
  if (error instanceof AppError) {
    return {
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      errorSources: [{ path: "", message: error.message }],
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaClientKnownRequestError(error);
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return handlePrismaClientUnknownError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return handlePrismaClientValidationError(error);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return handlerPrismaClientInitializationError(error);
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return handlerPrismaClientRustPanicError();
  }

  if (error instanceof z.ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Error) {
    return {
      success: false,
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: error.message || "Internal server error.",
      errorSources: [{ path: "", message: error.message || "Unknown error." }],
    };
  }

  const message = "An unexpected error occurred.";
  return {
    success: false,
    statusCode: status.INTERNAL_SERVER_ERROR,
    message,
    errorSources: [{ path: "", message }],
  };
};

export const globalErrorHandler: ErrorRequestHandler = async (
  error: unknown,
  req,
  res,
  _next,
) => {
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  const errorResponse = getErrorResponse(error);
  const statusCode = errorResponse.statusCode ?? status.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    ...errorResponse,
    ...(process.env.NODE_ENV === "development" && error instanceof Error
      ? { stack: error.stack }
      : {}),
  });
};