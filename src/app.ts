import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";


import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import router from "./routes";


const app = express();
app.set('trust proxy', true);

app.use(express.json());

//! CROS setup
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.APP_URL?.replace(/\/$/, "");
      if (!origin || origin.replace(/\/$/, "") === allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api", router);

app.use(notFound)
app.use(errorHandler)


export default app;