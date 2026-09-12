import { Router } from "express";
import * as pilotController from "../controllers/pilot.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", pilotController.register);
router.post("/login", pilotController.login);

router.get("/", requireAuth, pilotController.list);
router.get("/:id", requireAuth, pilotController.getById);
router.get("/:id/hours-summary", requireAuth, pilotController.hoursSummary);

export default router;
