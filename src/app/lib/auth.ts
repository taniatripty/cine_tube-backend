import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums"; 


export const auth = betterAuth({
     baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    user:{
        additionalFields: {
            role: {
                type:"string",
                defaultValue: UserRole.USER,
                required: true
            },
            status: {
                type:"string",
                defaultValue: UserStatus.ACTIVE,
                required: true
            },
            needpasswordChange: {
                type:"boolean",
                defaultValue: false,
                required: true
            }
        }
            
    }
});