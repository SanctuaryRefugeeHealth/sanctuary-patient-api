exports.up = function(knex) {
    return knex.schema.createTable("Appointments", table => {
        table
            .integer("appointmentId")
            .unsigned()
            .notNullable();

        table.text("patientName").notNullable();

        table.text("patientPhoneNumber").notNullable();

        table.enu("patientLanguage", ["english", "arabic", "spanish"]);

        table.text("practitionerName").notNullable();

        table.text("practitionerClinicName").notNullable();

        table.text("practitionerAddress").notNullable();

        table.text("practitionerPhoneNumber").notNullable();

        table.text("appointmentTime").notNullable();

        table.boolean("appointmentIsConfirmed");

        table.charset("utf8");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Appointments");
};
