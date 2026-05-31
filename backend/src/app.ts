import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import chatRoutes from "./routes/chat.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorHandler } from "./core/errorHandler";
import { routeNotFoundError } from "./core/routeNotFoundError";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.send("Ghost Coach API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(routeNotFoundError);
app.use(errorHandler);

export default app;
