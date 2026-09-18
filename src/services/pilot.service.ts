import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { ApiError } from "../middleware/errorHandler";
import { getDurationMins } from "../lib/duration";

export async function createPilot(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}) {
  const existing = await prisma.pilot.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, "A pilot with this email already exists");

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.pilot.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role ?? "STUDENT",
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });
}

export async function getPilotById(id: string) {
  const pilot = await prisma.pilot.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });
  if (!pilot) throw new ApiError(404, "Pilot not found");
  return pilot;
}

export async function listPilots() {
  return prisma.pilot.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

// This is the kind of business logic that makes the project worth showing:
// total logged minutes per flight type for a given pilot.
export async function getPilotHoursSummary(picId: string) {
  const flights = await prisma.flight.findMany({
    where: { picId },
    select: { offblock: true, onblock: true, type: true },
  });

  const summary: Record<string, number> = {};
  let totalMins = 0;

  for (const flight of flights) {
    const durationMins = getDurationMins(flight.offblock, flight.onblock);
    summary[flight.type] = (summary[flight.type] || 0) + durationMins;
    totalMins += durationMins;
  }

  return {
    totalHours: Math.round((totalMins / 60) * 10) / 10,
    byType: Object.fromEntries(
      Object.entries(summary).map(([type, mins]) => [type, Math.round((mins / 60) * 10) / 10])
    ),
  };
}
