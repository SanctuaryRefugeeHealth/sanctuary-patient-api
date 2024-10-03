export function up(knex) {
  return knex.schema.alterTable("appointments", (table) => {
    table.datetime("appointmentTime").notNullable().alter();
  });
}

export function down(knex) {
  return knex.schema.alterTable("appointments", (table) => {
    table.text("appointmentTime").notNullable().alter();
  });
}
