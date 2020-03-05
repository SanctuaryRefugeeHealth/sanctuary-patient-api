exports.up = function(knex) {
    return knex.schema.createTable("messages", table => {
        table.increments("messageId").notNullable();

        table
            .integer("appointmentId")
            .unsigned()
            .notNullable();

        table.text("templateName");

        table.text("messageBody").notNullable();

        table
            .timestamp("timeSent")
            .nullable()
            .defaultTo(null);

        table.enu("language", ["english", "arabic", "spanish"]);

        table
            .foreign(["appointmentId"], "fk-messages-appointments-1")
            .references(["appointmentId"])
            .inTable("appointments");

        table.charset("utf8");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("messages");
};
