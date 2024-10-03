import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../config.js";
import { getUserByEmail, hashPassword } from "../../../models/users.js";

/*
 * Create a token for a user.
 */
export async function getToken(req, res) {
  let user = null;
  const { email, password } = req.body;

  try {
    user = await getUserByEmail(email);
  } catch (error) {
    return res.status(500).send({
      message: "Authentication failed. User not found.",
    });
  }

  if (!user) {
    return res.status(401).send({
      message: "Authentication failed. User not found.",
    });
  }
  let hash;

  try {
    hash = hashPassword(password, user.salt);
  } catch (error) {
    console.error("Failed to hash password", error);
  }

  if (hash !== user.password) {
    return res.status(401).send({
      message: "Authentication failed. Wrong password.",
    });
  }

  const payload = {
    userEmail: user.email,
  };
  const token = jwt.sign(payload, jwtConfig.jwtSecret, {
    algorithm: "HS256",
    expiresIn: jwtConfig.jwtTokenExpiry,
  });

  return res.json({
    token,
  });
}
