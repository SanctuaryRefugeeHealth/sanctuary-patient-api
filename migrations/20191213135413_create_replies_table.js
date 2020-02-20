exports.up = function(knex) {
    return knex.schema.createTable("replies", table => {
        table.increments("replyId").notNullable();

        table.text("phoneNumber").notNullable();

        table.text("body").notNullable();

        table
            .integer("appointmentId")
            .unsigned()
            .notNullable();

        table.timestamp("time")
            .nullable()
            .defaultTo(null);

        table
            .foreign(["appointmentId"], "fk-replies-appointments-1")
            .references(["appointmentId"])
            .inTable("appointments");

        table.charset("utf8");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("replies");
};
