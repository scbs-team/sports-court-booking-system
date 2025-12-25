import express from "express";
import bookingRoutes from "./routes/booking.routes";
import courtRoutes from "./routes/court.routes";

const app = express();

app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use("/api/courts", courtRoutes);

export default app;
