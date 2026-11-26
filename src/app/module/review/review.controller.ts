import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewService } from "./review.services";

const getAllReviews = catchAsync(async (_req: Request, res: Response) => {
  const data = await reviewService.getAllReviews();

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully.",
    data,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.getMyReviews(req.user);

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully.",
    data,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.createReview(req.user, req.body);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Review created successfully.",
    data,
  });
});

const moderateReview = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.moderateReview(
    req.user,
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Review moderated successfully.",
    data,
  });
});

const setReviewReaction = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.setReviewReaction(
    req.user,
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Review reaction saved successfully.",
    data,
  });
});

const removeReviewReaction = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.removeReviewReaction(
    req.user,
    req.params.id as string,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Review reaction removed successfully.",
    data,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.updateReview(
    req.user,
    req.params.id as string,
    req.body,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Review updated successfully.",
    data,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewService.deleteReview(
    req.user,
    req.params.id as string,
  );

  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Review deleted successfully.",
    data,
  });
});

export const reviewController = {
  getAllReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  moderateReview,
  setReviewReaction,
  removeReviewReaction,
};