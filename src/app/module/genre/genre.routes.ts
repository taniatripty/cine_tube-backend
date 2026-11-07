import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { genreController } from "./genre.controller";
import { createGenreValidation } from "./genre.validation";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  genreController.getAllGenres,
);
router.post(
  "/",
  checkAuth(UserRole.ADMIN,UserRole.USER),
  validateRequest(createGenreValidation),
  genreController.createGenre,
);

export const genreRoutes = router;