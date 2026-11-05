
import { Request,Response } from "express";
import { authService } from "./auth.services";

export const register = async (req:Request, res:Response) => {
  const data = await authService.registerUser(req.body);

  res.status(201).json({
    message: "Registration successful.",
    data,
  });
};