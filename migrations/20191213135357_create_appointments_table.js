exports.up = function(knex) {
    return knex.schema.createTable("Appointments", table => {
        table
            .integer("appointmentId")
            .unsigned()
            .notNullable();

        table.text("patientName").notNullable();

        table.text("patientPhoneNumber").notNullable();

        table.text("patientLanguage").notNullable();

        table.text("practitionerName").notNullable();

        table.text("practitionerClinicName").notNullable();

        table.text("practitionerAddress").notNullable();

        table.text("practitionerPhoneNumber").notNullable();

        table.text("appointmentTime").notNullable();

        table.text("appointmentIsConfirmed").notNullable();

        table.charset("utf8");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Appointments");
};
