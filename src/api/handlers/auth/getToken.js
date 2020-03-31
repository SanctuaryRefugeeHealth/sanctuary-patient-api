import jwt from "jsonwebtoken";
import { db } from "../../../../knex";
import { jwtConfig } from "../../../config";

/*
 * Create a token for a user.
 */
export async function getToken(req, res, next) {
  let user = null;

  try {
    user = await db("users")
    .select("email", "password")
    .where("email", req.body.email)
    .first();
  } catch (error) {
    return res.json({ success: false, message: "Authentication failed. User not found." });
  }

  if (!user) {
    return res.json({ success: false, message: "Authentication failed. User not found." });
  }

  if (user.password !== req.body.password) {
    return res.json({ success: false, message: "Authentication failed. Wrong password." });
  }

  const payload = {
    userEmail: user.email,
  };
  const token = jwt.sign(payload, jwtConfig.jwtSecret, {
    expiresIn: 1440,
  });
  
  res.json({
    success: true,
    token,
  });
  
  return next();
}