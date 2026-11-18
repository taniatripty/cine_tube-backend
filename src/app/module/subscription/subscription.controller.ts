import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { subscriptionService } from "./subscription.services";

const createSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const data = await subscriptionService.createSubscription(
      req.user,
      req.body,
    );

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Subscription checkout created successfully.",
      data,
    });
  },
);

export const subscriptionController = {
  createSubscription,
};