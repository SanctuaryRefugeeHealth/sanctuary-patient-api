
const random_name = require("node-random-name");

// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

exports.seed = (knex) => {

  return Promise.all([
    knex("replies").del(),
    knex("messages").del()
  ])
    .then(() => { knex("appointments").del() })
    .then(() => {
      const promises = [];
      const languages = ["english", "arabic", "spanish", "tigrinya", "somali", "turkish"]
      for (let i = 0; i <= 10; i++) {
        let doctorName = random_name({ seed: `Doctor names ${i}` });
        promises.push(
          knex("appointments").insert({
            patientName: random_name({ seed: `Patient names ${i}` }), 
            patientPhoneNumber: "555-534-2987", 
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
    });
};
