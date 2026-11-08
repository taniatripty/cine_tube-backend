import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { authcontroller } from "./auth.controller";

const router = Router();

router.post("/register",authcontroller.register);
router.post("/login", authcontroller.login);
router.get("/all", checkAuth(UserRole.ADMIN, UserRole.USER), authcontroller.getAllUsers);
router.get("/me", checkAuth(UserRole.ADMIN, UserRole.USER), authcontroller.getMe);
router.post("/refresh-token", authcontroller.getnewRefreshToken);
export const authRoutes = router;