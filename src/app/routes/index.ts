import { Router } from "express";
import authRoutes from "../module/auth/auth.routes";

const router=Router();
router.use("/register",authRoutes);

export const indexRoutes=router;

