exports.up = function(knex) {
    return knex.schema.createTable("replies", table => {
        table.increments("appointmentId").notNullable();

        table.text("phoneNumber").notNullable();

        table.text("body").notNullable();

        table
            .integer("appointmentId")
            .unsigned()
            .notNullable();

        table.timestamp("time").nullable();

        table.primary("replyId");

        table
            .foreign(["appointmentId"], "fk-replies-appointments-1")
            .references(["appointmentId"])
            .inTable("Appointments");

        table.charset("utf8");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Replies");
};
