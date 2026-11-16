import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { genreRoutes } from "../module/genre/genre.routes";
import { mediaRoutes } from "../module/media/media.routes";
import { personRoutes } from "../module/person/person.route";
import { seasonRoutes } from "../module/season/season.routes";
import { streamingPlatformRoutes } from "../module/streamingPlatform/streamingPlatform.routes";


const router=Router();
router.use("/auth",authRoutes);
router.use("/genres", genreRoutes);
router.use("/media", mediaRoutes);
router.use("/person", personRoutes);
router.use("/seasons", seasonRoutes);
router.use("/streaming-platforms", streamingPlatformRoutes);

export const indexRoutes=router;
