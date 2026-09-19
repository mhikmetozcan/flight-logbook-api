import { Router } from "express";
import * as flightController from "../controllers/flight.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

// TODO: build this yourself, following the exact pattern in pilot.routes.ts
//       + pilot.controller.ts + pilot.service.ts:
//
//   POST   /api/flights          create a flight log entry
router.post("/flights", requireAuth, flightController.createFlight);

//   GET    /api/flights/:id      get one flight
router.get("/:id", requireAuth, flightController.getFlight);

//   GET    /api/flights?pilotId= list flights, filterable by pilot
//   PATCH  /api/flights/:id      update a flight (instructor sign-off, remarks)
//   DELETE /api/flights/:id      remove a flight (admin/instructor only)
//
// Service-layer logic worth adding once the CRUD works:
//   - currency check: "is this pilot current for night flying"
//     (EASA-style: 3 takeoffs & landings in the preceding 90 days)
//   - validation that instructorId is required when type is not SOLO

export default router;

