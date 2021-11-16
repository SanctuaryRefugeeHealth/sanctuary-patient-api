import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "express-jwt";
import http from "http";
import morgan from "morgan";
import api from "./api";
import { config } from "./config";
import reminderScheduler from "./services/scheduler";

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  bodyParser.json({
    limit: config.bodyLimit,
  })
);

reminderScheduler.start();

app.use(
  jwt({
    secret: config.jwtConfig.jwtSecret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/twilio/reply", // Authentication handled by Twilio middleware
      "/api/ping", // Open health check
      "/api/auth", // Used to login
    ],
  })
);

app.use("/api", api({ config }));

app.server.listen(config.port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
