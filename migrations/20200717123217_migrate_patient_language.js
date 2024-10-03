export async function up(knex) {
  await knex.schema.table("appointments", (table) => {
    table.string("language", 255);
  });

  await knex("appointments").update({
    language: knex.ref("patientLanguage"),
  });

  await knex.schema.alterTable("appointments", (table) => {
    table
      .string("language")
      .notNullable()
      .references("name")
      .inTable("languages")
      .onUpdate("CASCADE")
      .alter();
  });
}

export async function down(knex) {
  await knex.schema.table("appointments", (table) => {
    table.dropForeign("language");
    table.dropColumn("language");
  });
}
