
exports.up = function (knex) {
  // Create new patient table
  return knex.schema.createTable("patients", (table) => {
    table.increments("id").primary();
    table.text("name");
    table.text("phoneNumber");
    table.enum("language", ["english","arabic","spanish"]);
  })
    // Get all patients and add foreign key to appointments table
    .then(() => {
      return Promise.all([
        knex.select("appointmentId", "patientName", "patientPhoneNumber", "patientLanguage").from("appointments"),
        knex.schema.table("appointments", (table) => {
          table.integer("patientId").unsigned();
          table.foreign("patientId").references("patients.id").onDelete("cascade");
        })
      ])
    })
    // Insert all patients from appointments into patient table and update the foreign key in appointments
    .then(([patients]) => 
      Promise.all(patients.map((patient) => {
        return knex("patients").insert({name: patient.patientName, phoneNumber: patient.patientPhoneNumber, language: patient.patientLanguage})
          .then((patientId) => {
            return knex("appointments")
              .where("appointmentId", "=", patient.appointmentId)
              .update({ patientId: patientId});
          });
      }))
    )
    // Drop the columns that are no longer needed
    .then(() =>
      knex.schema.table("appointments", (table) => {
        table.dropColumns("patientName", "patientPhoneNumber", "patientLanguage");
      })
    );
};

exports.down = function(knex) {
  // Get patients; Put the removed columns back into appointments
  return Promise.all([
    knex.select("*").from("appointments").innerJoin("patients", "appointments.patientId", "patients.id"),
    knex.schema.table("appointments", (table) => {
      table.text("patientName");
      table.text("patientPhoneNumber");
      table.enum("patientLanguage", ["english","arabic","spanish"]);
    })
  ])
    // Move the patients back into their appointments
    .then(([appointments]) =>
      Promise.all(
        appointments.map((appointment) => {
          return knex("appointments")
            .where("appointmentId", "=", appointment.appointmentId)
            .update({ patientName: appointment.name, patientPhoneNumber: appointment.phoneNumber, patientLanguage: appointment.language});
        })
      )
    )
    // Remove the foreign key
    .then(() => 
      knex.schema.table("appointments", (table) => {
        table.dropForeign("patientId");
        table.dropColumn("patientId");
      })
    )
    // Drop the new table
    .then(() =>knex.schema.dropTable("patients"));
};
