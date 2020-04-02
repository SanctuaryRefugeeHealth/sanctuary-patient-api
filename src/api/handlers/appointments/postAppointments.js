import moment from "moment";
import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";
import LanguagesModel from "../../../models/languages";
import { sendMessage } from "../../../services/twilioClient";

export default async (req, res) => {
  const {
    date,
    location,
    patientLanguage,
    patientName,
    practitionerClinicName,
    patientPhoneNumber,
    practitionerPhoneNumber,
    specialistName
  } = req.body;

  const appointment = {
    patientName,
    patientPhoneNumber,
    patientLanguage,
    practitionerName: specialistName,
    practitionerClinicName,
    practitionerAddress: location,
    practitionerPhoneNumber,
    appointmentTime: date,
    appointmentIsConfirmed: false
  };

  let insertedAppointmentId;
  try {
    insertedAppointmentId = await db("appointments").insert(appointment);
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not insert appointment for ${patientPhoneNumber}`
    });
    return;
  }

  const language = LanguagesModel.getByLanguageString(patientLanguage);
  const template = TemplatesModel.getById(1);
  const messageBody = TemplatesModel.generateMessage(1, language.id, appointment);

  const message = {
    appointmentId: insertedAppointmentId,
    messageBody,
    language: language.id,
    templateName: template.templateName,
    // UTC
    timeSent: moment().format("YYYY-MM-DD HH:mm:ss")
  };

  sendMessage(patientPhoneNumber, messageBody)
    .then(async () => {
      let messageId;
      try {
        messageId = await db("messages").insert(message);
      } catch (error) {
        res.status(500).send({
          error,
          message: "Could not save message to database"
        });
      }
      res.status(200).send({
        insertedAppointmentId,
        messageId: messageId[0]
      });
      return;
    })
    .catch((error) => {
      res.status(500).send({
        error,
        insertedAppointmentId
      })
      return;
    });
};
