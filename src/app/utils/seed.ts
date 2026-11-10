import { UserRole } from "../../../src/generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
  try {
    const isAdminexist = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });
    if (isAdminexist) {
      console.log("Already exist  admin");
      return;
    }
    const adminuser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Tania Tripty",
        role: UserRole.ADMIN,
        needpasswordChange: false,
        rememberMe: false,
      },
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: adminuser.user.id,
        },
        data: {
          emailVerified: true,
        },
      });
      await tx.admin.create({
        data: {
          userId: adminuser.user.id,
          name: "Tania Tripty",
          email: envVars.ADMIN_EMAIL,
        },
      });
    });
    const admin = await prisma.admin.findFirst({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });
    console.log(" Admin created", admin);
  } catch (error) {
    console.log("Error seeding admin", error);
    await prisma.user.delete({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
    });
  }
};
