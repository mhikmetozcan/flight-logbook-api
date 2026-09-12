import { PrismaClient } from "@prisma/client";

// A single shared Prisma instance. Without this pattern, hot-reloading
// in dev (ts-node-dev) can open a new DB connection on every file save.
const prisma = new PrismaClient();

export default prisma;
