export function up(knex) {
  return knex.schema.table("appointments", (table) =>
    table
      .enum("patientLanguage", [
        "english",
        "arabic",
        "spanish",
        "amharic",
        "somali",
        "turkish",
      ])
      .alter()
  );
}

export function down(knex) {
  return knex.schema.table("appointments", (table) =>
    table
      .enum("patientLanguage", [
        "english",
        "arabic",
        "spanish",
        "tigrinya",
        "somali",
        "turkish",
      ])
      .alter()
  );
}
