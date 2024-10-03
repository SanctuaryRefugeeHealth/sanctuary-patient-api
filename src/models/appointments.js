import { db } from "../../knex.js";

const appointmentFields = [
  "appointmentId",
  "patientName",
  "patientPhoneNumber",
  "practitionerAddress",
  "appointmentTime",
  "appointmentIsConfirmed",
  "description",
  "specialNotes",
  "isDeleted",
  "translator",
  "language",
  { patientLanguage: "language" },
];

export async function createAppointment(appointment) {
  return db("appointments").insert(appointment);
}

export const confirmAppointment = (
  trx,
  appointmentId,
  appointmentIsConfirmed
) => {
  return trx("appointments").where({ appointmentId }).update({
    appointmentIsConfirmed,
  });
};

export const updateLastReminderSentAt = (trx, appointmentId, time) => {
  return trx("appointments")
    .update("lastReminderSentAt", time)
    .where("appointmentId", appointmentId);
};

export const requestTranslator = (trx, appointmentId, translator) => {
  return trx("appointments").where({ appointmentId }).update({
    translator,
  });
};

export const getAppointments = (patientPhoneNumber) => {
  const query = db("appointments")
    .select(appointmentFields)
    .where({ isDeleted: false });

  if (patientPhoneNumber) {
    query.andWhere({ patientPhoneNumber });
  }

  return query;
};

export const getAppointment = (appointmentId) => {
  return db("appointments")
    .select(appointmentFields)
    .where({ appointmentId: appointmentId, isDeleted: false })
    .first();
};
