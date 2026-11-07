import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { genreService } from "./genre.services";

const createGenre = catchAsync(async (req: Request, res: Response) => {
  const data = await genreService.createGenre(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Genre created successfully.",
    data,
  });
});

const getAllGenres = catchAsync(async (_req: Request, res: Response) => {
  const data = await genreService.getAllGenres();

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Genres retrieved successfully.",
    data,
  });
});

export const genreController = {
  createGenre,
  getAllGenres,
};