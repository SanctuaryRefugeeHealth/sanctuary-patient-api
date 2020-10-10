import { db } from "../../../../knex";

export async function getAppointments(patientPhoneNumber) {
  return await db("appointments")
    .select("appointmentId", "language")
    .where({ patientPhoneNumber, appointmentIsConfirmed: 0 });
}

export async function insertReply(trx, patientPhoneNumber, messageFromPatient, appointmentId) {
  await db("replies")
            .insert({
              phoneNumber: patientPhoneNumber,
              body: messageFromPatient,
              appointmentId,
              time: new Date(),
            })
            .transacting(trx);
}

export async function updateAppointment(trx, appointmentId, appointmentIsConfirmed) {
  await db("appointments")
  .where({ appointmentId })
  .update({
    appointmentIsConfirmed,
  })
  .transacting(trx);
}
