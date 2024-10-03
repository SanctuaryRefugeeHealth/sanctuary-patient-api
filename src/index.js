import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { expressjwt } from "express-jwt";
import http from "http";
import morgan from "morgan";
import api from "./api/index.js";
import { corsHeaders, bodyLimit, port, jwtConfig } from "./config.js";
import reminderScheduler from "./services/scheduler.js";

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: corsHeaders,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  bodyParser.json({
    limit: bodyLimit,
  })
);

reminderScheduler.start();

app.use(
  expressjwt({
    secret: jwtConfig.jwtSecret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/twilio/reply", // Authentication handled by Twilio middleware
      "/api/ping", // Open health check
      "/api/auth", // Used to login
    ],
  })
);

app.use("/api", api());

app.server.listen(port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
