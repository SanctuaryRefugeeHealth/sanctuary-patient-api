import { Router } from 'express';
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config";

const authenticate = (req, res, next) => {

  // This route is validated by Twilio's middleware
  if (req.originalUrl === "/api/twilio/reply") {
    return next();
  }

  // check header or url parameters or post parameters for token
  let token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token) return res.status(401).send({ success: false, message: "Unauthorized." });
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, jwtConfig.jwtSecret);
  } catch (error) {
    return res.status(401).send({ success: false, message: "Unauthorized." });
  }

  // Can also set the JWT as a cookie and "refresh" the expiry time so every protected call refreshes the token.
  req.decoded = decoded;
  return next();
}

// eslint-disable-next-line no-unused-vars
export default ({ config, db }) => {
  let routes = Router();
  
  routes.use(/\/((?!auth|ping).)*/, authenticate);

	return routes;
}
