export async function up(knex) {
  await knex.schema.table("appointments", (table) => {
    table.boolean("translator");
  });
}

export function down(knex) {
  return knex.schema.table("appointments", (table) => {
    table.dropColumn("translator");
  });
}
