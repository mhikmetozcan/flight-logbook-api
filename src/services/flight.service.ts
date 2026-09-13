import prisma from "../lib/prisma";
import { ApiError } from "../middleware/errorHandler";

export async function createFlight(data: {
  date: Date;
  departure: string;
  destination: string;
  registration: string;
  make: string;
  offblock: string;
  takeoff: string;
  landing: string;
  onblock: string;
  numberOfLandings: string;
}) {
  const existing = await prisma.flight.findUnique({ where: { 
    date: data.date,
    departure: data.departure,
    destination: data.destination,
    registration: data.registration,
    offblock: data.offblock,
    onblock: data.onblock
} });
  if (existing) throw new ApiError(409, "A flight with this data already exists");

  return prisma.flight.create();
}