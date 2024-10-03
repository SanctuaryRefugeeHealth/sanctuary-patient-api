import random_name from "node-random-name";
import moment from "moment";

// LINK: https://stackoverflow.com/questions/563406/add-days-to-javascript-date
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export async function seed(knex) {
  const languages = [
    "english",
    "arabic",
    "spanish",
    "amharic",
    "somali",
    "turkish",
  ];

  await Promise.all([knex("replies").del(), knex("messages").del()]);
  knex("appointments").del();
  const promises = [];
  for (let i = 0; i <= 10; i++) {
    promises.push(
      knex("appointments").insert({
        patientName: random_name({ seed: `Patient names ${i}` }),
        patientPhoneNumber: "5555555555",
        language: languages[Math.floor(Math.random() * languages.length)],
        practitionerAddress: "123 Fake St.",
        appointmentTime: addDays(
          new Date(),
          Math.floor(Math.random() * Math.floor(28))
        ),
        appointmentIsConfirmed: Math.round(Math.random()),
      })
    );
  }
  const appointmentIds = await Promise.all(promises);
  const promises_1 = [];
  appointmentIds.forEach((appointmentId) => {
    promises_1.push(
      knex("messages").insert({
        appointmentId,
        templateName: "Appointment Reminder",
        // NOTE: Template not important right now for seed.
        messageBody:
          "Hello, \
              this is a message from Dr. Michael Stephenson's office for {{patientName}}. \
              You have an appointment on {{appointmentTime}} \
              at the following address {{practitionerAddress}}.",
        timeSent: moment().format("YYYY-MM-DD HH:mm:ss"),
        language: languages[Math.floor(Math.random() * languages.length)],
      })
    );

    promises_1.push(
      knex("replies").insert({
        appointmentId,
        phoneNumber: `5555555555`,
        body: "Thank you for the reminder!",
        timeSent: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
    );
  });
  return await Promise.all(promises_1);
}
