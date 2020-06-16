
const random_name = require("node-random-name");
const moment = require("moment");


// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

exports.seed = (knex) => {
  const languages = ["english", "arabic", "spanish", "amharic", "somali", "turkish"]

  return Promise.all([
    knex("replies").del(),
    knex("messages").del()
  ])
    .then(() => { knex("appointments").del() })
    .then(() => {
      const promises = [];

      for (let i = 0; i <= 10; i++) {
        let doctorName = random_name({ seed: `Doctor names ${i}` });
        promises.push(
          knex("appointments").insert({
            patientName: random_name({ seed: `Patient names ${i}` }), 
            patientPhoneNumber: "555-555-5555", 
            patientLanguage: languages[Math.floor(Math.random() * languages.length)],
            practitionerName: `Dr. ${doctorName}`,
            practitionerClinicName: `${doctorName} Clinic`,
            practitionerAddress: "123 Fake St.",
            practitionerPhoneNumber: "555-555-5555",
            appointmentTime: addDays(new Date(), (Math.floor(Math.random() * Math.floor(28)))),
            appointmentIsConfirmed: Math.round(Math.random())
          })
        )
      }
      return Promise.all(promises);
    })
    .then((appointmentIds) => {
      const promises = [];

      appointmentIds.forEach((appointmentId) => {
        promises.push(
          knex("messages").insert({
            appointmentId,
            templateName: "Appointment Reminder",
            // Template not important right now for seed.
            messageBody: "Hello, \
              this is a message from Dr. Michael Stephenson's office for {{patientName}}. \
              You have an appointment with Dr. {{practitionerClinicName}} on {{appointmentTime}} \
              at the following address {{practitionerAddress}}.", 
            timeSent: moment().format("YYYY-MM-DD HH:mm:ss"),
            language: languages[Math.floor(Math.random() * languages.length)],
          })
        )

        promises.push(
          knex("replies").insert({
            appointmentId,
            phoneNumber: `555-555-5555`,
            body: "Thank you for the reminder!", 
            time: moment().format("YYYY-MM-DD HH:mm:ss")
          })
        )
      });

      return Promise.all(promises);
    })
};
