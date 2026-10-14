const express = require("express");
const dotenv = require("dotenv");

interface ApiStatusResponse {
  name: string;
  status: "running";
}

type Request = import("express").Request;
type Response = import("express").Response;
type NextFunction = import("express").NextFunction;

const pool = require("./db").pool;
const professionalsRouter = require("./routes/professionals");

dotenv.config();

const app = express();
const PORT: number | string = process.env.PORT || 3000;
const frontendOrigins = new Set(
  (process.env.FRONTEND_ORIGINS ?? "http://localhost:8000,http://127.0.0.1:8000")
    .split(",")
    .map((origin: string) => origin.trim())
    .filter(Boolean)
);

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.get("Origin");

  if (origin && frontendOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.vary("Origin");
  }

  next();
});

app.use("/professionals", professionalsRouter);

app.get("/", (_req: Request, res: Response) => {
  const response: ApiStatusResponse = {
    name: "ProMark API",
    status: "running",
  };

  res.json(response);
});

app.get("/health", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT 1+1 AS result", []);

    res.json({ status: "healthy", dbResult: result.rows[0].result });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({ status: "unhealthy", error: "Database connection failed" });
  }
});

// 1. Meta Webhook Verification (GET)
app.get("/webhook", async (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_TOKEN) {
    console.log("Webhook verified successfully!");
    return res.status(200).send(challenge);
  }

  console.log("Webhook verification failed!");
  return res.sendStatus(403);
});

app.listen(PORT, () => {
  console.log(`ProMark API running on http://localhost:${PORT}`);
});