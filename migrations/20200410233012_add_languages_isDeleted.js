
exports.up = (knex) => {
  return knex.schema.table("appointments", (table) => {
    table.enum("patientLanguage", ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]).defaultTo("english").alter();
    table.boolean("isDeleted").defaultTo("false").notNullable();
  })
    .then(() => {
      return knex.schema.table("messages", (table) => {
        table.enum("language", ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]).alter();
      });
    });
};

exports.down = (knex) => {
  return knex.schema.table("appointments", (table) => {
    table.enum("patientLanguage", ["english", "arabic", "spanish"]).alter();
    table.dropColumn("isDeleted");
  })
    .then(() => {
      return knex.schema.table("messages", (table) => {
        table.enum("language", ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]).alter();
      });
    })
};
