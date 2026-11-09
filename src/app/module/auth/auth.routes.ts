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
router.post("/forget-password",authcontroller.forgetpassword)
router.post("/reset-password",authcontroller.resetpassword);
router.post("/logout",checkAuth(UserRole.ADMIN,UserRole.USER), authcontroller.logoutUser);
router.get("/login/google", authcontroller.googleLogin);
router.get("/google/success", authcontroller.googleloginSuccess);
export const authRoutes = router;