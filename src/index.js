import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import morgan from "morgan";
import jwt from "express-jwt";
import api from "./api";
import config from "./config";
import initializeDb from "./db";

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

app.use(
  jwt({
    secret: config.jwtConfig.jwtSecret,
    algorithms: ["HS256"],
    getToken: (req) => {
      console.log(req.headers);
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      }

      return req.headers["x-access-token"];
    },
  }).unless({
    path: [
      "/api/twilio/reply", // Authentication handled by Twilio middleware
      "/api/ping",
      "/api/auth",
    ],
  })
);

// connect to db
initializeDb((db) => {
  // api router
  app.use("/api", api({ config, db }));

  app.server.listen(config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
