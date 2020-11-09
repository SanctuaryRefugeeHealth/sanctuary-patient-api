import { pbkdf2Sync } from "crypto";

import { db } from "../../knex";

export function getUserByEmail(email) {
  return db("users")
    .select("email", "password", "salt")
    .where("email", email)
    .first();
}

export function hashPassword(password, salt) {
  return pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}
