import { randomBytes, pbkdf2Sync } from "crypto";

export function seed(knex) {
  return knex("users")
    .del()
    .then(() => {
      const salt = randomBytes(16).toString("hex");
      const hash = pbkdf2Sync("sanctuary", salt, 1000, 64, "sha512").toString(
        "hex"
      );
      return knex("users").insert({
        email: "one@test.com",
        salt,
        password: hash,
      });
    });
}
