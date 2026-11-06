import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { getAllUsers, login, register } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all", checkAuth(UserRole.ADMIN, UserRole.USER), getAllUsers);

export const authRoutes = router;