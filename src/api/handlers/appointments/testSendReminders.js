import moment from "moment";
import { db } from "../../../../knex";
import LanguagesModel from "../../../models/languages";
import TemplatesModel from "../../../models/templates";
import { sendMessage } from "../../../services/twilioClient";

const daysFromNow = (interval) => {
  return moment().add(interval, "d").format("YYYY-MM-DD hh:mm:ss");
};

export async function test(req, res) {
  let appointments;
  try {
    appointments = await db("appointments")
      .select("*")
      .where("appointmentId", 39);
    // appointments = await db("appointments")
    //   .select("*")
    //   .where("isDeleted", false)
    //   .where("appointmentTime", ">=", daysFromNow(1))
    //   .where("appointmentTime", "<", daysFromNow(3));
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not retrieve appointments for ${daysFromNow(
        1
      )} and ${daysFromNow(2)}`,
    });
    return;
  }
  console.log("here1");
  for (const appointment of appointments) {
    const { appointmentId, language, patientPhoneNumber } = appointment;

    // console.log(patientLanguage);
    const lang = await LanguagesModel.getByLanguageString(language);
    console.log(lang);
    // 1 is reminder template ID, full templated needed for name in message record
    // const template = TemplatesModel.getById(1);
    console.log("here2");

    const message = TemplatesModel.generateMessage(1, lang.name, {
      patientName: appointment.patientName,
      practitionerAddress: appointment.practitionerAddress,
      appointmentTime: moment(appointment.appointmentTime).format("LLLL"),
    });
    console.log("here3");

    const test = await sendMessage(patientPhoneNumber, message);

    console.log(test);
  }

  // const appointmentsPromises = appointments.map(appointment => {
  //   const {
  //     appointmentId,
  //     patientLanguage,
  //     patientPhoneNumber
  //   } = appointment;

  // // console.log(patientLanguage);
  //   const language = LanguagesModel.getByLanguageString(patientLanguage);
  //   // 1 is reminder template ID, full templated needed for name in message record
  //   const template = TemplatesModel.getById(1);
  //   const message = TemplatesModel.generateMessage(1, language.id, {
  //     patientName: appointment.patientName,
  //     practitionerAddress: appointment.practitionerAddress,
  //     appointmentTime: moment(appointment.appointmentTime).format('LLLL')
  //   });

  //     try {
  //       await sendMessage(patientPhoneNumber, messageBody);
  //     } catch (error) {
  //       return resolve({
  //         error,
  //         message: `Failed to send appointment reminder to ${patientPhoneNumber}`
  //       });
  //     }

  //   // const message = {
  //   //   appointmentId,
  //   //   messageBody,
  //   //   language: language.id,
  //   //   templateName: template.templateName,
  //   //   // UTC, will be the same for every message sent in a batch
  //   //   timeSent: moment().format("YYYY-MM-DD HH:mm:ss")
  //   // };

  //   // return new Promise(async (resolve) => {
  //   //   try {
  //   //     await sendMessage(patientPhoneNumber, messageBody);
  //   //   } catch (error) {
  //   //     return resolve({
  //   //       error,
  //   //       message: `Failed to send appointment reminder to ${patientPhoneNumber}`
  //   //     });
  //   //   }

  //   //   let messageId;
  //   //   try {
  //   //     messageId = await db("messages").insert(message);
  //   //   } catch (error) {
  //   //     return resolve({
  //   //       error,
  //   //       message: "Could not save message to database"
  //   //     });
  //   //   }
  //   //   return resolve({
  //   //     appointmentId,
  //   //     messageId: messageId[0]
  //   //   });
  //   // });
  // });
  // console.log(appointmentsPromises);

  // return res.send(appointmentsPromises);
  return res.send();
  // return Promise.all(appointmentsPromises)
  //   .then((result) => res.status(200).send(result))
  //   .catch((error) => res.status(500).send({
  //       error,
  //       message: `Could not send reminders for ${daysFromNow(1)}`
  //     })
  //   );
}

export async function test2(req, res) {
  //patientName, practitionerAddress, appointmentTime
  // const template = TemplatesModel.getById(1);
  const messageBodies = [];
  for (let i = 1; i < 7; i++) {
    messageBodies.push(
      TemplatesModel.generateMessage(1, i, {
        patientName: "Steve Davis",
        practitionerAddress: "123 Fake St.",
        appointmentTime: new Date().toString(),
      })
    );
  }

  for (let i = 1; i < 7; i++) {
    try {
      await sendMessage("15198078870", messageBodies[i]);
    } catch (error) {
      console.log(error);
    }
  }

  return res.status(204).send();
}
