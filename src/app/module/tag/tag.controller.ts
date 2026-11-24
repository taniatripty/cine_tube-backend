import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { tagService } from "./tag.services";

const createTag = catchAsync(async (req: Request, res: Response) => {
  const data = await tagService.createTag(req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Tag created successfully.",
    data,
  });
});

const getAllTags = catchAsync(async (_req: Request, res: Response) => {
  const data = await tagService.getAllTags();

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Tags retrieved successfully.",
    data,
  });
});

export const tagController = {
  createTag,
  getAllTags,
};