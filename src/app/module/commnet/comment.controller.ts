import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { commentService } from "./comment.services";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.createComment(req.user, req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Comment created successfully.",
    data,
  });
});

export const commentController = {
  createComment,
};