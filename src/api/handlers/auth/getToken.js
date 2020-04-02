import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../../../knex";
import { jwtConfig } from "../../../config";

/*
 * Create a token for a user.
 */
export async function getToken(req, res) {
  let user = null;
  const { email, password } = req.body;

  try {
    user = await db("users")
      .select("email", "password")
      .where("email", email)
      .first();
  } catch (error) {
    return res.status(500).send({ success: false, message: "Authentication failed. User not found." });
  }

  if (!user) {
    return res.status(401).send({ success: false, message: "Authentication failed. User not found." });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({ success: false, message: "Authentication failed. Wrong password." });
  }

  const payload = {
    userEmail: user.email,
  };
  const token = jwt.sign(payload, jwtConfig.jwtSecret, {
    expiresIn: jwtConfig.jwtTokenExpiry,
  });
  
  return res.json({
    success: true,
    token,
  });
}
