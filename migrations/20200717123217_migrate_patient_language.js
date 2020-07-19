exports.up = async (knex) => {
  await knex.schema.table("appointments", (table) => {
    table
      .string("language", 255)
      .references("name")
      .inTable("languages")
      .onUpdate("CASCADE");
  });

  await knex("appointments").update({
    language: knex.ref("patientLanguage"),
  });

  await knex.schema.alterTable("appointments", (table) => {
    table.string("language").notNullable().alter();
  });
};

exports.down = async (knex) => {
  await knex.schema.table("appointments", (table) => {
    table.dropForeign("language");
    table.dropColumn("language");
  });
};
