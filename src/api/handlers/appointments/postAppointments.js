import Joi from "@hapi/joi";

import { createAppointment } from "../../../models/appointments.js";
import { sendReminder } from "../../../services/reminders.js";

const schema = Joi.object({
  patientName: Joi.string().trim().required(),
  patientPhoneNumber: Joi.string()
    .trim()
    .length(10)
    .pattern(/^\d+$/)
    .required(),
  date: Joi.date().required(),
  patientLanguage: Joi.string().trim().required(),
  practitionerAddress: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow(null),
  specialNotes: Joi.string().trim().optional().allow(null),
});

export default async (req, res) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(500).json({
      message: error.details[0].message,
    });
  }

  const {
    date,
    practitionerAddress,
    patientLanguage: language,
    patientName,
    patientPhoneNumber,
    description,
    specialNotes,
  } = req.body;

  const appointment = {
    patientName,
    patientPhoneNumber,
    language,
    practitionerAddress,
    appointmentTime: date,
    description,
    specialNotes,
    appointmentIsConfirmed: null,
  };

  try {
    const inserted = await createAppointment(appointment);
    appointment.appointmentId = inserted[0];
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not insert appointment for ${patientPhoneNumber}`,
    });
    return;
  }
  try {
    await sendReminder(appointment);
  } catch (error) {
    return res
      .status(500)
      .send({ error, message: "Failed to send appointment reminder" });
  }

  res.status(200).send({
    insertedAppointmentId: appointment.id,
  });
  return;
};
