import express from "express";
import cors from "cors";
import pilotRoutes from "./routes/pilot.routes";
import flightRoutes from "./routes/flight.routes";
import aircraftRoutes from "./routes/aircraft.routes";
import certificationRoutes from "./routes/certification.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/pilots", pilotRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/aircraft", aircraftRoutes);
app.use("/api/certifications", certificationRoutes);

// Must be registered last: this catches errors thrown/passed to next() by any route above.
app.use(errorHandler);

export default app;
