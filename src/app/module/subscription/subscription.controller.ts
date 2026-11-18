import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.services";

const createCheckout = catchAsync(async (req: Request, res: Response) => {
  const data = await SubscriptionService.createCheckout(req.user, req.body);

  sendResponse({
    res,
    statusCode: status.CREATED,
    success: true,
    message: "Subscription checkout session created successfully.",
    data,
  });
});

const getMySubscriptions = catchAsync(async (req: Request, res: Response) => {
  const data = await SubscriptionService.getMySubscriptions(req.user);

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Subscriptions retrieved successfully.",
    data,
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const data = await SubscriptionService.cancelSubscription(
    req.user,
    req.params.subscriptionId as string,
  );

  sendResponse({
    res,
    statusCode: status.OK,
    success: true,
    message: "Subscription scheduled for cancellation.",
    data,
  });
});

export const SubscriptionController = {
  createCheckout,
  getMySubscriptions,
  cancelSubscription,
};