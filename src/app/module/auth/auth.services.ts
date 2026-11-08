import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IRequest } from "../../interface/requestUser.interface";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHandler/AppError";
import status from "http-status";
import { jwtutils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginUserPayload = {
  email: string;
  password: string;
};

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
   const accessToken =tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        
      
    });



  return {
    ...data,
    accessToken,
    refreshToken,
  }
};

const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const getAllUsers = async () => {
  const data=prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
};

const getMe = async (user: IRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      wishList: {
        include: {
          media: true,
        },
      },
      reviews: {
        include: {
          media: true,
        },
      },
    },
  });

  if (!existingUser) {
    throw new Error("User does not exist.");
  }

  return existingUser;
};

const getnewRefreshToken=async(refreshToken:string,sessionToken:string)=>{
  const sessionTokenExists= await prisma.session.findFirst({
    where:{
      token:sessionToken
    },
    include:{
      user:true
    }
  })
  if(!sessionTokenExists){
    throw new AppError(status.NOT_FOUND,`user is not exists`)
  }

  
  const varifyRefreshToken= jwtutils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET)
  if(!varifyRefreshToken.success && varifyRefreshToken.error){
    throw new AppError(status.BAD_REQUEST,`invalid refresh token`)
  }
 const data=  varifyRefreshToken.data as JwtPayload
   const newaccessToken =tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
      
    });

    const newrefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        
     
    });

    const {token}=await prisma.session.update({
      where:{
        token:sessionToken
      },
       data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() +   60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }

        
    })

     return {
        accessToken :newaccessToken,
        refreshToken :newrefreshToken,
        sessionToken : token
    }

}

const logoutUser = async (sessionToken : string) => {
    const result = await auth.api.signOut({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    return result;
}

export const authService = {
  registerUser,
  loginUser,
  getAllUsers,
  getMe,
  getnewRefreshToken,
  logoutUser
};