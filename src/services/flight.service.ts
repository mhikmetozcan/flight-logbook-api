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