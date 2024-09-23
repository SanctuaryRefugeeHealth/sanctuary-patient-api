export async function up(knex) {
  await knex.schema.table("appointments", (table) => {
    table.datetime("lastReminderSentAt");
  });

  await knex("appointments").update({
    lastReminderSentAt: knex.fn.now(),
  });
}

export function down(knex) {
  return knex.schema.table("appointments", (table) => {
    table.dropColumn("lastReminderSentAt");
  });
}
