import moment from "moment";
import { db } from "../../../../knex";
import LanguagesModel from "../../../models/languages";
import TemplatesModel from "../../../models/templates";
import { sendMessage } from "../../../services/twilioClient";


const daysFromNow = (interval) => {
  return moment().add(interval, "d").format("YYYY-MM-DD hh:mm:ss");
};

export default async (req, res) => {
  let appointments;
  try {
    appointments = await db("appointments")
      .select("*")
      .where("isDeleted", false)
      .where("appointmentTime", ">=", daysFromNow(1))
      .where("appointmentTime", "<", daysFromNow(3));
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not retrieve appointments for ${daysFromNow(1)} and ${daysFromNow(2)}`
    });
    return;
  }

  const appointmentsPromises = appointments.map(appointment => {
    const {
      appointmentId,
      patientLanguage,
      patientPhoneNumber
    } = appointment;
  
    const language = LanguagesModel.getByLanguageString(patientLanguage);
    // 1 is reminder template ID, full templated needed for name in message record
    const template = TemplatesModel.getById(1);
    const messageBody = TemplatesModel.generateMessage(1, language.id, appointment);

    const message = {
      appointmentId,
      messageBody,
      language: language.id,
      templateName: template.templateName,
      // UTC, will be the same for every message sent in a batch
      timeSent: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    return new Promise(async (resolve) => {
      try {
        await sendMessage(patientPhoneNumber, messageBody);
      } catch (error) {
        return resolve({
          error,
          message: `Failed to send appointment reminder to ${patientPhoneNumber}`
        });
      }

      let messageId;
      try {
        messageId = await db("messages").insert(message);
      } catch (error) {
        return resolve({
          error,
          message: "Could not save message to database"
        });
      }
      return resolve({
        appointmentId,
        messageId: messageId[0]
      });
    });
  });

  return Promise.all(appointmentsPromises)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send({ 
        error,
        message: `Could not send reminders for ${daysFromNow(1)}`
      })
    );
};
