import moment from "moment";
import Joi from "@hapi/joi";

import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";
import LanguagesModel from "../../../models/languages";
import { sendMessage } from "../../../services/twilioClient";

const schema = Joi.object({
  patientName: Joi.string().trim().required(),
  patientPhoneNumber: Joi.string()
    .trim()
    .length(10)
    .pattern(/^\d+$/)
    .required(),
  location: Joi.string().trim().required(),
  date: Joi.string().trim().required(),
  patientLanguage: Joi.string().trim().required(),
  practitionerPhoneNumber: Joi.string()
    .trim()
    .length(10)
    .pattern(/^\d+$/)
    .required(),
  specialistName: Joi.string().trim().required(),
  practitionerClinicName: Joi.string().trim().required(),
  // The below can be removed once the frontend no longer sends them
  appointmentDate: Joi.string(),
  appointmentTime: Joi.string(),
});

export default async (req, res) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.details[0].message,
      error,
    });
  }

  const {
    date,
    location,
    patientLanguage,
    patientName,
    practitionerClinicName,
    patientPhoneNumber,
    practitionerPhoneNumber,
    specialistName,
  } = req.body;

  const appointment = {
    patientName,
    patientPhoneNumber,
    language: patientLanguage,
    practitionerName: specialistName,
    practitionerClinicName,
    practitionerAddress: location,
    practitionerPhoneNumber,
    appointmentTime: date,
    appointmentIsConfirmed: false,
  };

  let insertedAppointmentId;
  try {
    insertedAppointmentId = await db("appointments").insert(appointment);
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not insert appointment for ${patientPhoneNumber}`,
    });
    return;
  }

  const language = await LanguagesModel.getByLanguageString(patientLanguage);
  const template = TemplatesModel.getById(1);
  const messageBody = TemplatesModel.generateMessage(
    1,
    language.name,
    appointment
  );

  const message = {
    appointmentId: insertedAppointmentId,
    messageBody,
    language: language.name,
    templateName: template.templateName,
    // UTC
    timeSent: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  try {
    await sendMessage(patientPhoneNumber, messageBody);
  } catch (error) {
    res
      .status(500)
      .send({ error, message: "Failed to send appointment reminder" });
    return;
  }

  let messageId;
  try {
    messageId = await db("messages").insert(message);
  } catch (error) {
    res.status(500).send({
      error,
      message: "Could not save message to database",
    });
    return;
  }

  res.status(200).send({
    insertedAppointmentId,
    messageId: messageId[0],
  });
  return;
};
