import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../config";

/*
 * Validate a users auth token
 */
export function authenticate(req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token) return res.json({ success: false, message: "Unauthorized." });
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.json({ success: false, message: "Expired token." });
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
