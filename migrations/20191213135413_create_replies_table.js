export function up(knex) {
  return knex.schema.createTable("replies", (table) => {
    table.increments("replyId").notNullable();

    table.text("phoneNumber").notNullable();

    table.text("body").notNullable();

    table.integer("appointmentId").unsigned().notNullable();

    table
      .timestamp("timeSent", { useTz: false })
      .nullable()
      .defaultTo(knex.fn.now());

    table
      .foreign(["appointmentId"], "fk-replies-appointments-1")
      .references(["appointmentId"])
      .inTable("appointments");

    table.charset("utf8");
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("replies");
}
