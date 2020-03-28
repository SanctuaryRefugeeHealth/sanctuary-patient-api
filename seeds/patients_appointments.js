
const random_name = require("node-random-name");

exports.seed = function(knex) {
  return Promise.all([
    knex("appointments").del(), 
    knex("patients").del()
  ])
    .then(() => 
      Promise.all([
        knex("patients").insert({name: "Steve Davis", phone_number: "555-534-2987", language: "arabic"}),
        knex("patients").insert({name: "Clark Teeple", phone_number: "555-254-2234", language: "english"}),
        knex("patients").insert({name: "Kris Braun", phone_number: "555-994-3744", language: "spanish"})
      ])
    )
    .then((patientIds) =>
      Promise.all(patientIds.map((id) => {
        return knex("appointments").insert({
          practitionerName: `Dr. ${random_name()}`,
          practitionerClinicName: `${random_name()} Clinic`,
          practitionerAddress: "123 Fake St.",
          practitionerPhoneNumber: "555-555-5555",
          appointmentTime: new Date().toLocaleString(),
          appointmentIsConfirmed: Math.round(Math.random()),
          patient_id: id,
        });
      }))
    );
};
