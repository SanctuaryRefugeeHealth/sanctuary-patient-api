import { randomBytes } from "crypto";
import { db } from "../../../../knex";
import {hashPassword} from "../../../models/users";

/*
 * Create a new user.
 */
export async function createUser(req, res) {
  const { email, password } = req.body;
  const query = `
    INSERT INTO users
      (email, password, salt)
    VALUES
      (:email, :password, :salt)
  `;
  try {
    const salt = randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    await db.raw(query, { email, password: hash, salt });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Could not create user." });
  }

  return res.status(204).send();
}
