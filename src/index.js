import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "express-jwt";
import http from "http";
import morgan from "morgan";
import api from "./api";
import { config, validateConfig } from "./config";
import reminderScheduler from "./services/scheduler";

class Application {
  constructor() {
    this.app = express();
  }

  start() {
    validateConfig();

    this.app.server = http.createServer(this.app);
    this.app.use(morgan("dev"));
    // 3rd party middleware
    this.app.use(cors({ exposedHeaders: config.corsHeaders }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: config.bodyLimit }));

    // logger

    reminderScheduler.start();

    this.app.use(
      jwt({ secret: config.jwtConfig.jwtSecret, algorithms: ["HS256"] }).unless(
        {
          path: [
            "/api/twilio/reply", // Authentication handled by Twilio middleware
            "/api/ping", // Open health check
            "/api/auth", // Used to login
          ],
        }
      )
    );

    this.app.use("/api", api({ config }));

    this.app.server.listen(config.port, () => {
      console.log(`Started on port ${this.app.server.address().port}`);
    });
  }

  stop() {
    this.app.server.close();
  }
}

const application = new Application();
application.start();

export default application;
