import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { episodeRoutes } from "../module/episode/episode.routes";
import { genreRoutes } from "../module/genre/genre.routes";
import { mediaRoutes } from "../module/media/media.routes";
import { personRoutes } from "../module/person/person.route";
import { seasonRoutes } from "../module/season/season.routes";
import { subscriptionRoutes } from "../module/subscription/subscription.routes";
import { streamingPlatformRoutes } from "../module/streamingPlatform/streamingPlatform.routes";
import { watchListRoutes } from "../module/watchList/watchlist.routes";




const router=Router();
router.use("/auth",authRoutes);
router.use("/episodes", episodeRoutes);
router.use("/genres", genreRoutes);
router.use("/media", mediaRoutes);
router.use("/person", personRoutes);
router.use("/seasons", seasonRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/streaming-platforms", streamingPlatformRoutes);
router.use("/watchlists", watchListRoutes);

export const indexRoutes=router;
