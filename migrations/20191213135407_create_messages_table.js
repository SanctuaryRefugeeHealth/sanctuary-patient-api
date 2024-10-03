export function up(knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments("messageId").notNullable();

    table.integer("appointmentId").unsigned().notNullable();

    table.text("templateName");

    table.text("messageBody").notNullable();

    table.timestamp("timeSent", { useTz: false }).nullable().defaultTo(null);

    table.enu("language", ["english", "arabic", "spanish"]);

    table
      .foreign(["appointmentId"], "fk-messages-appointments-1")
      .references(["appointmentId"])
      .inTable("appointments");

    table.charset("utf8");
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("messages");
}
