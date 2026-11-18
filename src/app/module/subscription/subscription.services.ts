import status from "http-status";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import AppError from "../../errorHandler/AppError";
import { TCreateSubscriptionInput } from "./subscription.interface";

const createSubscription = async (
  user: { userId: string; email: string },
  payload: TCreateSubscriptionInput,
) => {
  const price = await stripe.prices.retrieve(payload.stripePriceId);

  if (!price.active || !price.recurring) {
    throw new AppError(
      status.BAD_REQUEST,
      "The selected Stripe price must be active and recurring.",
    );
  }

  const frontendUrl = envVars.FRONTEND_URL.replace(/\/+$/, "");
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: price.id, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.userId,
    metadata: {
      userId: user.userId,
    },
    subscription_data: {
      metadata: {
        userId: user.userId,
      },
    },
    success_url: `${frontendUrl}/?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/?subscription=cancelled`,
  });

  if (!session.url) {
    throw new AppError(
      status.BAD_GATEWAY,
      "Stripe did not return a checkout URL.",
    );
  }

  return {
    checkoutSessionId: session.id,
    checkoutUrl: session.url,
  };
};

export const subscriptionService = {
  createSubscription,
};