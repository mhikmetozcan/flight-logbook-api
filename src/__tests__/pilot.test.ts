import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";

// These are integration tests: they hit the real Express app + a real
// (test) database via Prisma. Run against a separate DATABASE_URL for
// tests so you never wipe your dev data — see README.

describe("Pilot API", () => {
  const testEmail = `test-pilot-${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.pilot.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("registers a new pilot", async () => {
    const res = await request(app).post("/api/pilots/register").send({
      email: testEmail,
      password: "supersecure123",
      firstName: "Mustafa",
      lastName: "Test",
      role: "STUDENT",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testEmail);
    expect(res.body).not.toHaveProperty("passwordHash"); // never leak this
  });

  it("rejects duplicate registration with the same email", async () => {
    const res = await request(app).post("/api/pilots/register").send({
      email: testEmail,
      password: "supersecure123",
      firstName: "Mustafa",
      lastName: "Test",
    });

    expect(res.status).toBe(409);
  });

  it("rejects registration with an invalid email", async () => {
    const res = await request(app).post("/api/pilots/register").send({
      email: "not-an-email",
      password: "supersecure123",
      firstName: "Mustafa",
      lastName: "Test",
    });

    expect(res.status).toBe(400);
  });

  it("logs in and returns a JWT", async () => {
    const res = await request(app).post("/api/pilots/login").send({
      email: testEmail,
      password: "supersecure123",
    });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });

  it("rejects requests to protected routes without a token", async () => {
    const res = await request(app).get("/api/pilots");
    expect(res.status).toBe(401);
  });
});

// TODO once you build Flights yourself: write a unit test (no HTTP, no DB —
// just the function) for the currency-calculation logic. That's the single
// test an interviewer is most likely to ask you to walk through, since it's
// pure business logic rather than boilerplate CRUD.
