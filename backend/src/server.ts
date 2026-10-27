import express from "express";
import cors from "cors";
import router from "./routes/route";
import "./scheduler/cron";
import cookieParser from "cookie-parser";
import { prisma } from "./prismac";

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", router);

async function startServer() {
  try {
    await prisma.connect();
    console.log("✅ Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err);
    process.exit(1);
  }
}

startServer();

export default app;
