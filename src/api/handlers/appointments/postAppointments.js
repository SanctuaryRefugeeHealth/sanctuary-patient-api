import Joi from "@hapi/joi";

import { db } from "../../../../knex";
import { sendReminder } from "./sendReminders";

const schema = Joi.object({
  patientName: Joi.string().trim().required(),
  patientPhoneNumber: Joi.string()
    .trim()
    .length(10)
    .pattern(/^\d+$/)
    .required(),
  date: Joi.string().trim().required(),
  patientLanguage: Joi.string().trim().required(),
  practitionerAddress: Joi.string().trim().required(),
  description: Joi.string().optional().allow(null),
  specialNotes: Joi.string().optional().allow(null),
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
    practitionerAddress,
    patientLanguage,
    patientName,
    patientPhoneNumber,
    description,
    specialNotes,
  } = req.body;

  const appointment = {
    patientName,
    patientPhoneNumber,
    language: patientLanguage,
    practitionerAddress,
    appointmentTime: date,
    appointmentIsConfirmed: false,
    description,
    specialNotes
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
    {
    ...appointment,
    appointmentDateTime: moment(appointment.appointmentTime).format(
      "YYYY-MM-DD h:mm a"
    ),
    appointmentDate: moment(appointment.appointmentTime).format(
      "YYYY-MM-DD"
    ),
    appointmentTime: moment(appointment.appointmentTime).format(
      "h:mm a"
    ),
  });

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
