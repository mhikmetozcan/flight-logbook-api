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

const updateFlightSchema = createFlightSchema.partial();

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

export async function listFlights(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (typeof req.query.picId === "string") {
      return res.json(await flightService.listFlightsByPilot(req.query.picId));
    }
    if (typeof req.query.coPilotId === "string") {
      return res.json(await flightService.listFlightsByCoPilot(req.query.coPilotId));
    }
    res.status(400).json({ error: "picId or coPilotId query param required" });
  } catch (err) {
    next(err);
  }
}

export async function updateFlight(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const data = updateFlightSchema.parse(req.body);
    if (Object.keys(data).length === 0) throw new ApiError(400, "No fields provided to update");
    const flightId = req.params.id;

    const flight = await flightService.updateFlight(flightId, data);
    res.json(flight);
  } catch (err) {
    next(err);
  }
}


export async function deleteFlight(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const flightId = req.params.id;
    const flight = await flightService.getFlightById(flightId);

    const isPic = req.user!.id === flight.picId;
    const isAdmin = req.user!.role === "ADMIN";
    if (!isPic && !isAdmin) {
      throw new ApiError(403, "Only the pilot in command or an admin can delete this flight");
    }

    await flightService.deleteFlight(flightId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}