import { Response, NextFunction } from "express";
import { z } from "zod";
import { FlightType } from "@prisma/client";
import * as flightService from "../services/flight.service";
import { AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

const blockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be an HH:MM time");

const createFlightSchema = z.object({
  picId: z.string(),
  coPilotId: z.string().optional(),
  date: z.coerce.date(),
  type: z.nativeEnum(FlightType),
  departure: z.string().min(1),
  destination: z.string().min(1),
  aircraftId: z.string(),
  offblock: blockTime,
  takeoff: z.string(),
  landing: z.string(),
  onblock: blockTime,
  numberOfLandings: z.number().int().nonnegative(),
});

export async function createFlight(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const data = createFlightSchema.parse(req.body);

    const isParticipant = req.user!.id === data.picId || req.user!.id === data.coPilotId;
    const isAdmin = req.user!.role === "ADMIN";
    if (!isParticipant && !isAdmin) {
      throw new ApiError(403, "Only the pilot, co-pilot, or an admin can log this flight");
    }

    const flight = await flightService.createFlight(data);
    res.status(201).json(flight);
  } catch (err) {
    next(err);
  }
}

export async function getFlight(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const flight = await flightService.getFlightById(req.params.id);
    res.json(flight);
  } catch (err) {
    next(err);
  }
}
