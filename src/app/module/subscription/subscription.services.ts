import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { prisma } from "../../lib/prisma";
import {
  PaymentPurpose,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { TCreateSubscriptionCheckoutInput } from "./subscription.interface";
import { randomUUID } from "node:crypto";

const createCheckout = async (
  user: IRequest,
  payload: TCreateSubscriptionCheckoutInput,
) => {
  const price = await stripe.prices.retrieve(payload.stripePriceId);
  if (!price.active || price.type !== "recurring") {
    throw new AppError(
      status.BAD_REQUEST,
      "Only active recurring Stripe prices can create subscriptions.",
    );
  }

  const amount = price.unit_amount ? price.unit_amount / 100 : 0;

  const payment = await prisma.payment.create({
    data: {
      userId: user.userId,
      purpose: PaymentPurpose.SUBSCRIPTION,
      currency: (price.currency || "usd").toUpperCase(),
      amount,
      transactionId: randomUUID(),
      status: PaymentStatus.UNPAID,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    success_url: `${envVars.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/subscription/cancel`,
    line_items: [
      {
        quantity: 1,
        price: payload.stripePriceId,
      },
    ],
    metadata: {
      userId: user.userId,
      paymentId: payment.id,
    },
    subscription_data: {
      metadata: {
        userId: user.userId,
        paymentId: payment.id,
      },
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    paymentId: payment.id,
  };
};

const getMySubscriptions = async (user: IRequest) => {
  return prisma.subscription.findMany({
    where: { userId: user.userId },
    include: { payment: true },
    orderBy: { createdAt: "desc" },
  });
};

const cancelSubscription = async (user: IRequest, subscriptionId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId: user.userId },
  });

  if (!subscription) {
    throw new AppError(status.NOT_FOUND, "Subscription not found.");
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: true },
  });
};

export const SubscriptionService = {
  createCheckout,
  getMySubscriptions,
  cancelSubscription,
};