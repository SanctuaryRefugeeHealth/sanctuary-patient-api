
exports.up = (knex) => {
  return knex.schema.table("appointments", (table) => {
    table.enum("patientLanguage", ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]).defaultTo("english").alter();
    table.boolean("isDeleted").defaultTo("false").notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.table("appointments", (table) => {
    table.enum("patientLanguage", ["english", "arabic", "spanish"]).alter();
    table.dropColumn("isDeleted");
  });
};
