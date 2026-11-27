import status from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import AppError from "../../errorHandler/AppError";
import { IRequest } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { TUpdateProfileInput } from "./user.interface";

const updateProfile = async (user: IRequest, payload: TUpdateProfileInput) => {
  if (payload.name === undefined && payload.image === undefined) {
    throw new AppError(
      status.BAD_REQUEST,
      "At least one field (name or image) is required to update profile.",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, role: true },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  return prisma.$transaction(async (transaction) => {
    const updatedUser = await transaction.user.update({
      where: { id: existingUser.id },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (existingUser.role === UserRole.ADMIN) {
      await transaction.admin.updateMany({
        where: { userId: existingUser.id, isDeleted: false },
        data: {
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.image !== undefined
            ? { profilePhoto: payload.image }
            : {}),
        },
      });
    }

    return updatedUser;
  });
};

export const userService = {
  updateProfile,
};
