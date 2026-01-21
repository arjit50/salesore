import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import leadRoutes from "./modules/leads/lead.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

export default app;
