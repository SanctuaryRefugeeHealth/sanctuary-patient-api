exports.up = async function (knex) {
  await knex.schema.table("appointments", (table) => {
    table.datetime("lastReminderSentAt");
  });

  await knex("appointments").update({
    lastReminderSentAt: knex.fn.now(),
  });
};

exports.down = function (knex) {
  return knex.schema.table("appointments", (table) => {
    table.dropColumn("lastReminderSentAt");
  });
};
