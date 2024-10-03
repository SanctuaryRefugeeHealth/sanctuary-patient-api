export async function up(knex) {
  await knex("languages").insert({ name: "Tigrinya" });
}

export async function down(knex) {
  await knex("languages").where({ name: "Tigrinya" }).del();
}
