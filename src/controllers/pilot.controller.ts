import { Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { JWT_SECRET } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";
import * as pilotService from "../services/pilot.service";
import { AuthedRequest } from "../middleware/auth";

const createPilotSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional(),
});

export async function register(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const data = createPilotSchema.parse(req.body);
    const pilot = await pilotService.createPilot(data);
    res.status(201).json(pilot);
  } catch (err) {
    next(err);
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const pilot = await prisma.pilot.findUnique({ where: { email } });
    if (!pilot) throw new ApiError(401, "Invalid email or password");

    const valid = await bcrypt.compare(password, pilot.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid email or password");

    const token = jwt.sign({ id: pilot.id, role: pilot.role }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const pilot = await pilotService.getPilotById(req.params.id);
    res.json(pilot);
  } catch (err) {
    next(err);
  }
}

export async function list(_req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const pilots = await pilotService.listPilots();
    res.json(pilots);
  } catch (err) {
    next(err);
  }
}

export async function hoursSummary(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const summary = await pilotService.getPilotHoursSummary(req.params.id);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}
