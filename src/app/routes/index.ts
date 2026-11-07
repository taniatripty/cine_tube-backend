import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { genreRoutes } from "../module/genre/genre.routes";
import { mediaRoutes } from "../module/media/media.routes";


const router=Router();
router.use("/auth",authRoutes);
router.use("/genres", genreRoutes);
router.use("/media", mediaRoutes);

export const indexRoutes=router;
