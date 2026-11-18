import status from "http-status";
import AppError from "../../errorHandler/AppError";
import { prisma } from "../../lib/prisma";
import { IRequest } from "../../interface/requestUser.interface";
import {
  AccessType,
  SubscriptionStatus,
} from "../../../generated/prisma/enums";

const getMyAccess = async (user: IRequest) => {
  return prisma.mediaAccess.findMany({
    where: {
      userId: user.userId,
      revokedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: { media: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
};

const hasMediaAccess = async (userId: string, mediaId: string) => {
  const media = await prisma.media.findFirst({
    where: { id: mediaId, isDeleted: false },
    select: { id: true },
  });

  if (!media) {
    throw new AppError(status.NOT_FOUND, "Media not found.");
  }

  const ownedAccess = await prisma.mediaAccess.findFirst({
    where: {
      userId,
      mediaId,
      revokedAt: null,
      OR: [
        { type: AccessType.PURCHASE, expiresAt: null },
        {
          type: { in: [AccessType.RENT_MONTH, AccessType.RENT_YEAR] },
          expiresAt: { gt: new Date() },
        },
      ],
    },
  });

  if (ownedAccess) {
    return {
      allowed: true,
      accessType: ownedAccess.type,
      expiresAt: ownedAccess.expiresAt,
    };
  }

  const now = new Date();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: [
        {
          status: {
            in: [
              SubscriptionStatus.ACTIVE,
              SubscriptionStatus.TRIALING,
              SubscriptionStatus.PAST_DUE,
            ],
          },
        },
        {
          status: SubscriptionStatus.CANCELED,
          currentPeriodEnd: { gt: now },
        },
      ],
      AND: [
        {
          OR: [
            { currentPeriodEnd: null },
            { currentPeriodEnd: { gt: now } },
          ],
        },
      ],
    },
  });

  if (subscription) {
    return {
      allowed: true,
      accessType: AccessType.SUBSCRIPTION,
      expiresAt: subscription.currentPeriodEnd,
    };
  }

  return {
    allowed: false,
    accessType: null,
    expiresAt: null,
  };
};

const checkMyMediaAccess = async (user: IRequest, mediaId: string) => {
  return hasMediaAccess(user.userId, mediaId);
};

const revokeAccess = async (accessId: string) => {
  const access = await prisma.mediaAccess.updateMany({
    where: { id: accessId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  if (access.count === 0) {
    throw new AppError(status.NOT_FOUND, "Active media access not found.");
  }

  return { accessId, revoked: true };
};

export const MediaAccessService = {
  getMyAccess,
  hasMediaAccess,
  checkMyMediaAccess,
  revokeAccess,
};