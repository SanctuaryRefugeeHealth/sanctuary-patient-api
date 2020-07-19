exports.up = async (knex) => {
  await knex.schema.table("appointments", (table) => {
    table.dropColumn("patientLanguage");
  });

  await knex.schema.table("messages", (table) => {
    table.dropColumn("patientLanguage");
  });
};

exports.down = async (knex) => {
  await knex.schema.table("appointments", (table) => {
    table
      .enum("patientLanguage", [
        "english",
        "arabic",
        "spanish",
        "amharic",
        "somali",
        "turkish",
      ])
      .defaultTo("english");
  });

  await knex("appointments").update({
    patientLanguage: knex.ref("language"),
  });

  await knex.schema.table("messages", (table) => {
    table
      .enum("patientLanguage", [
        "english",
        "arabic",
        "spanish",
        "amharic",
        "somali",
        "turkish",
      ])
      .defaultTo("english");
  });

  await knex("messages").update({
    patientLanguage: knex.ref("language"),
  });
};
