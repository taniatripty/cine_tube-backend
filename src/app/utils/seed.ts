import { UserRole } from "../../../src/generated/prisma/enums"
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
 try {
     const isSuperAdminexist = await prisma.user.findFirst({
    where: {
      role: UserRole.ADMIN,
    },
  });
  if (isSuperAdminexist) {
    console.log("already exist sper admin");
    return;
  }
  const superAdminuser = await auth.api.signUpEmail({
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
        id: superAdminuser.user.id,
      },
      data: {
        emailVerified: true,
      },
    });
    await tx.admin.create({
      data: {
        userId: superAdminuser.user.id,
        name: "Super Admin",
        email: envVars.ADMIN_EMAIL,
      },
    });
  });
  const superAdmin=await prisma.admin.findFirst({
    where:{
        email:envVars.ADMIN_EMAIL
    },
    include:{
        user:true
    }
  })
  console.log("super admin created",superAdmin)
    
 } catch (error) {
    console.log("Error seeding admin",error)
    await prisma.user.delete({
        where:{
            email:envVars.ADMIN_EMAIL
        }
    })
    
 }


};
