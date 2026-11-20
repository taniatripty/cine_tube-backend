import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewService } from "./review.services";

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

export const reviewController = {
  createReview,
  moderateReview,
};