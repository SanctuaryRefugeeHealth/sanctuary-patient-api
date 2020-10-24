exports.up = async (knex) => {
  await knex.schema.alterTable("messages", (table) => {
    table.renameColumn("language", "patientLanguage");
  });

  await knex.schema.table("messages", (table) => {
    table.string("language", 255);
  });

  await knex("messages").update({
    language: knex.ref("patientLanguage"),
  });

  await knex.schema.alterTable("messages", (table) => {
    table
      .string("language")
      .notNullable()
      .references("name")
      .inTable("languages")
      .onUpdate("CASCADE")
      .alter();
  });
};

exports.down = async (knex) => {
  await knex.schema.table("messages", (table) => {
    table.dropForeign("language");
    table.dropColumn("language");
  });

  await knex.schema.alterTable("messages", (table) => {
    table.renameColumn("patientLanguage", "language");
  });
};
