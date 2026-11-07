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

export const genreController = {
  createGenre,
};