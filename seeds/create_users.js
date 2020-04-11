const crypto = require("crypto");

exports.seed = (knex) => {
  return knex("users").del()
    .then(() => {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.pbkdf2Sync("sanctuary", salt, 1000, 64, "sha512").toString("hex");
      return knex("users").insert({
        email: "one@test.com",
        salt,
        password: hash
      });
    });
};
