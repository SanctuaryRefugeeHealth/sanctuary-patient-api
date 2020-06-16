
exports.up = (knex) => {
  return knex.schema.table("appointments", (table) => 
    table.enum("patientLanguage", ["english", "arabic", "spanish", "amharic", "somali", "turkish"]).alter()
  );
};

exports.down = (knex) => {
  return knex.schema.table("appointments", (table) =>
    table.enum("patientLanguage", ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]).alter()
  );
};
