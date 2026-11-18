import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { watchListController } from "./watchList.controller";
import { createWatchListValidation } from "./watchList.validation";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  watchListController.getMyWatchList,
);
router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  validateRequest(createWatchListValidation),
  watchListController.createWatchList,
);
router.delete(
  "/:mediaId",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  watchListController.deleteWatchListItem,
);

export const watchListRoutes = router;