import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums"; 
import { bearer, emailOTP } from "better-auth/plugins";
import { envVars } from "../config/env";
import { sendEmail } from "../utils/email";


export const auth = betterAuth({
     baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {
        enabled: true,
    },
     socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          needPasswordChange: false,
          isDeleted: false,
        };
      },
    },
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
            
    },
    plugins: [
       bearer(),
        emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type == "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (!user) {
            console.error(
              `User with email ${email} not found. Cannot send verification OTP.`,
            );
            return;
          }

          if (user && user.role === UserRole.ADMIN) {
            console.log(
              `User with email ${email} is a super admin. Skipping sending verification OTP.`,
            );
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "varify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "password reset otp",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 5 * 60, // 5 minutes in seconds
      otpLength: 6,
    }),
    ],

     trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],

  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
    },
  }
});