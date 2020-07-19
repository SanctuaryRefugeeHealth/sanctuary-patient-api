exports.up = async (knex) => {
  await knex.schema.alterTable("messages", (table) => {
    table.renameColumn("language", "patientLanguage");
  });

  await knex.schema.table("messages", (table) => {
    table
      .string("language", 255)
      .references("name")
      .inTable("languages")
      .onUpdate("CASCADE");
  });

  await knex("messages").update({
    language: knex.ref("patientLanguage"),
  });

  await knex.schema.alterTable("messages", (table) => {
    table.string("language").notNullable().alter();
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
