import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";


import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import router from "./routes";


const app = express();
// CRITICAL: Trust proxy for Vercel
app.set('trust proxy', 1);
const corsOptions = {
  origin: [
    process.env.APP_URL || "http://localhost:3000",
    "http://localhost:3001",
    "https://client-hazel-theta.vercel.app",
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "Origin",
    "Cache-Control",
    "X-CSRF-Token",
    "User-Agent",
    "Content-Length",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api", router);

app.use(notFound)
app.use(errorHandler)


export default app;