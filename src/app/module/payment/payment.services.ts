import Stripe from "stripe";
import {
  PaymentStatus,
  SubscriptionStatus,
} from "../../../generated/prisma/enums";
import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";

type PaymentEventUpdate = {
  event: Stripe.Event;
  paymentId: string;
  stripeObjectId: string;
  status: PaymentStatus;
  paymentIntentId?: string;
  paidAt?: Date;
};

const findPaymentIdByIntent = async (paymentIntentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    select: { id: true },
  });

  return payment?.id;
};

const updatePaymentFromEvent = async ({
  event,
  paymentId,
  stripeObjectId,
  status,
  paymentIntentId,
  paidAt,
}: PaymentEventUpdate) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { id: true, stripeEventId: true },
  });

  if (!payment) {
    throw new Error(`Payment ${paymentId} referenced by Stripe was not found`);
  }

  if (payment.stripeEventId === event.id) {
    return { message: `Event ${event.id} was already processed` };
  }

  const where =
    status === PaymentStatus.REFUNDED
      ? { id: payment.id }
      : status === PaymentStatus.PAID
        ? { id: payment.id, status: { not: PaymentStatus.REFUNDED } }
        : {
            id: payment.id,
            status: {
              notIn: [PaymentStatus.PAID, PaymentStatus.REFUNDED],
            },
          };

  const result = await prisma.payment.updateMany({
    where,
    data: {
      status,
      stripeEventId: event.id,
      ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      ...(paidAt ? { paidAt } : {}),
      paymentGatewayData: {
        eventId: event.id,
        eventType: event.type,
        objectId: stripeObjectId,
      },
    },
  });

  if (result.count === 0) {
    return { message: `Ignoring stale event ${event.id} for payment ${paymentId}` };
  }

  return { message: `Payment ${paymentId} updated to ${status}` };
};

const getPaymentIdForIntent = async (paymentIntent: Stripe.PaymentIntent) => {
  const metadataPaymentId = paymentIntent.metadata.paymentId;
  if (metadataPaymentId) {
    return metadataPaymentId;
  }

  const paymentId = await findPaymentIdByIntent(paymentIntent.id);
  if (!paymentId) {
    throw new Error(
      `No payment is linked to Stripe PaymentIntent ${paymentIntent.id}`,
    );
  }

  return paymentId;
};

const subscriptionStatusByStripeStatus: Record<string, SubscriptionStatus> = {
  incomplete: SubscriptionStatus.INCOMPLETE,
  active: SubscriptionStatus.ACTIVE,
  past_due: SubscriptionStatus.PAST_DUE,
  canceled: SubscriptionStatus.CANCELED,
  unpaid: SubscriptionStatus.UNPAID,
  trialing: SubscriptionStatus.TRIALING,
  incomplete_expired: SubscriptionStatus.CANCELED,
};

const syncSubscriptionFromStripe = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    select: { userId: true },
  });
  const userId = subscription.metadata.userId || existing?.userId;

  if (!userId) {
    return {
      message: `Ignoring Stripe subscription ${subscription.id} without a linked user.`,
    };
  }

  if (subscription.status === "paused") {
    return {
      message: `Stripe subscription ${subscription.id} is paused; the local schema has no paused status.`,
    };
  }

  const status = subscriptionStatusByStripeStatus[subscription.status];
  if (!status) {
    throw new Error(
      `Stripe subscription status ${subscription.status} is not supported by the local schema.`,
    );
  }

  const item = subscription.items.data[0];
  if (!item) {
    throw new Error(`Stripe subscription ${subscription.id} has no price item.`);
  }

  const data = {
    userId,
    stripePriceId: item.price.id,
    status,
    currentPeriodStart: new Date(item.current_period_start * 1000),
    currentPeriodEnd: new Date(item.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
  };

  return prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      ...data,
      stripeSubscriptionId: subscription.id,
    },
    update: data,
  });
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object;
      if (session.mode === "subscription") {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!subscriptionId) {
          if (event.type === "checkout.session.expired") {
            return { message: `Checkout session ${session.id} expired.` };
          }
          throw new Error(
            `Stripe Checkout session ${session.id} has no subscription.`,
          );
        }

        return syncSubscriptionFromStripe(subscriptionId);
      }

      const paymentId = session.metadata?.paymentId;

      if (!paymentId) {
        throw new Error(
          `Stripe Checkout session ${session.id} has no paymentId metadata`,
        );
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      const succeeded =
        event.type === "checkout.session.async_payment_succeeded" ||
        (event.type === "checkout.session.completed" &&
          (session.payment_status === "paid" ||
            session.payment_status === "no_payment_required"));

      return updatePaymentFromEvent({
        event,
        paymentId,
        stripeObjectId: session.id,
        status: succeeded ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        ...(succeeded ? { paidAt: new Date(event.created * 1000) } : {}),
        ...(paymentIntentId ? { paymentIntentId } : {}),
      });
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      return syncSubscriptionFromStripe(subscription.id);
    }

    case "payment_intent.succeeded":
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentId = await getPaymentIdForIntent(paymentIntent);
      const succeeded = event.type === "payment_intent.succeeded";

      return updatePaymentFromEvent({
        event,
        paymentId,
        stripeObjectId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        status: succeeded ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        ...(succeeded ? { paidAt: new Date(event.created * 1000) } : {}),
      });
    }

    case "charge.refunded": {
      const charge = event.data.object;
      if (charge.amount_refunded < charge.amount) {
        return {
          message: `Partial refund for charge ${charge.id} is not represented by PaymentStatus`,
        };
      }

      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (!paymentIntentId) {
        throw new Error(`Refunded charge ${charge.id} has no PaymentIntent`);
      }

      const paymentId = await findPaymentIdByIntent(paymentIntentId);
      if (!paymentId) {
        throw new Error(
          `No payment is linked to refunded PaymentIntent ${paymentIntentId}`,
        );
      }

      return updatePaymentFromEvent({
        event,
        paymentId,
        stripeObjectId: charge.id,
        paymentIntentId,
        status: PaymentStatus.REFUNDED,
      });
    }

    default:
      return { message: `Unhandled Stripe event type ${event.type}` };
  }
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};