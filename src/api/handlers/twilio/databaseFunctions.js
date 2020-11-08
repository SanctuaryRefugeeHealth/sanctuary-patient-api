import { db } from "../../../../knex";

export const getAppointments = (patientPhoneNumber) =>
  db("appointments")
    .select("appointmentId", "language")
    .where({ patientPhoneNumber });

export const insertReply = (
  trx,
  patientPhoneNumber,
  messageFromPatient,
  appointmentId
) =>
  db("replies")
    .insert({
      phoneNumber: patientPhoneNumber,
      body: messageFromPatient,
      appointmentId,
      time: new Date(),
    })
    .transacting(trx);

export const confirmAppointment = (
  trx,
  appointmentId,
  appointmentIsConfirmed
) =>
  db("appointments")
    .where({ appointmentId })
    .update({
      appointmentIsConfirmed,
    })
    .transacting(trx);

export const requestTranslator = (trx, appointmentId, translator) =>
  db("appointments")
    .where({ appointmentId })
    .update({
      translator,
    })
    .transacting(trx);
