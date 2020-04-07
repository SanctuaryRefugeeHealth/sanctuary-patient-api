import { pbkdf2Sync, randomBytes } from "crypto";
import { db } from "../../../../knex";

/*
 * Create a new user.
 */
export async function createUser(req, res) {
  const { email, password } = req.body;
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  const query = `
    INSERT INTO users
      (email, password, salt)
    VALUES
      (:email, :password, :salt)
    ON DUPLICATE KEY UPDATE
      password = :password,
      salt = :salt;
  `;
  try {
    await db.raw(query, {email, password: hash, salt});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Could not create user." });
  }
  
  return res.status(204).send();
}
