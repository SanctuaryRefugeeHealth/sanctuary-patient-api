
exports.up = function (knex) {
  return knex.schema.alterTable("appointments", (table) => {
    table.datetime("appointmentTime").notNullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("appointments", (table) => {
    table.text("appointmentTime").notNullable().alter();
  });
};
