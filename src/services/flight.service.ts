import { FlightType } from "@prisma/client";
import prisma from "../lib/prisma";
import { ApiError } from "../middleware/errorHandler";
import { getDurationMins } from "../lib/duration";

export async function createFlight(data: {
  picId: string,
  coPilotId?: string;
  date: Date;
  type: FlightType;
  departure: string;
  destination: string;
  aircraftId: string;
  offblock: string;
  takeoff: string;
  landing: string;
  onblock: string;
  numberOfLandings: number;
}) {
  const existing = await prisma.flight.findFirst({ where: { 
    aircraftId: data.aircraftId,
    date: data.date,
    offblock: data.offblock,
  } });
  if (existing) throw new ApiError(409, "A flight with this data already exists");

  const flight = await prisma.flight.create({
    data: {
        picId: data.picId,
        coPilotId: data.coPilotId,
        date: data.date,
        type: data.type,
        departure: data.departure,
        destination: data.destination,
        aircraftId: data.aircraftId,
        offblock: data.offblock,
        takeoff: data.takeoff,
        landing: data.landing,
        onblock: data.onblock,
        numberOfLandings: data.numberOfLandings,
    }
  });

  return { ...flight, durationMins: getDurationMins(flight.offblock, flight.onblock) };
}

export async function getFlightById(id: string) {
  const flight = await prisma.flight.findUnique({ where: { id } });
  if (!flight) throw new ApiError(404, "Flight not found");

  return { ...flight, durationMins: getDurationMins(flight.offblock, flight.onblock) };
}

export async function listFlightsByPilot(picId: string) {
  const pilot = await prisma.pilot.findUnique({ where: { id: picId } });
  if (!pilot) throw new ApiError(404, "Pilot not found");

  const flights = await prisma.flight.findMany({ where: { picId } });

  if (flights.length === 0) throw new ApiError(404, "Pilot has no recorded flights");

  return flights.map((flight) => ({
    ...flight,
    durationMins: getDurationMins(flight.offblock, flight.onblock),
  }));
}

export async function listFlightsByCoPilot(coPilotId: string) {
  const pilot = await prisma.pilot.findUnique({ where: { id: coPilotId } });
  if (!pilot) throw new ApiError(404, "Pilot not found");

  const flights = await prisma.flight.findMany({ where: { coPilotId } });

  if (flights.length === 0) throw new ApiError(404, "Pilot has no recorded flights");

  return flights.map((flight) => ({
    ...flight,
    durationMins: getDurationMins(flight.offblock, flight.onblock),
  }));
}

export async function updateFlight(id: string, data: {
  picId?: string,
  coPilotId?: string;
  date?: Date;
  type?: FlightType;
  departure?: string;
  destination?: string;
  aircraftId?: string;
  offblock?: string;
  takeoff?: string;
  landing?: string;
  onblock?: string;
  numberOfLandings?: number;
}) {
  let flight = await prisma.flight.findUnique({ where: { id } });
  if (!flight) throw new ApiError(404, "Flight not found");

  const aircraftId = data.aircraftId ?? flight.aircraftId;
  const date = data.date ?? flight.date;
  const offblock = data.offblock ?? flight.offblock;

  const existing = await prisma.flight.findFirst({
    where: { aircraftId, date, offblock, id: { not: id } },
  });
  if (existing) throw new ApiError(409, "A flight with this data already exists");


  flight = await prisma.flight.update({ where: { id }, data });
  return { ...flight, durationMins: getDurationMins(flight.offblock, flight.onblock) };
}