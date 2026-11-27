import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { commentService } from "./comment.services";

const getAllComments = catchAsync(async (_req: Request, res: Response) => {
  const data = await commentService.getAllComments();

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comments retrieved successfully.",
    data,
  });
});

const getMyComments = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.getMyComments(req.user);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comments retrieved successfully.",
    data,
  });
});

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

const moderateComment = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.moderateComment(
    req.user,
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comment moderated successfully.",
    data,
  });
});

const setCommentReaction = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.setCommentReaction(
    req.user,
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comment reaction saved successfully.",
    data,
  });
});

const removeCommentReaction = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.removeCommentReaction(
    req.user,
    req.params.id as string,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comment reaction removed successfully.",
    data,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.updateComment(
    req.user,
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comment updated successfully.",
    data,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const data = await commentService.deleteComment(
    req.user,
    req.params.id as string,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Comment deleted successfully.",
    data,
  });
});

export const commentController = {
  getAllComments,
  getMyComments,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
  setCommentReaction,
  removeCommentReaction,
};