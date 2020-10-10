import { db } from "../../../../knex";

export const getAppointments = (patientPhoneNumber) =>
  db("appointments")
    .select("appointmentId", "language")
    .where({ patientPhoneNumber, appointmentIsConfirmed: 0 });


export const insertReply = (trx, patientPhoneNumber, messageFromPatient, appointmentId) =>  db("replies")
            .insert({
              phoneNumber: patientPhoneNumber,
              body: messageFromPatient,
              appointmentId,
              time: new Date(),
            })
            .transacting(trx);

export const updateAppointment = (trx, appointmentId, appointmentIsConfirmed) => db("appointments")
  .where({ appointmentId })
  .update({
    appointmentIsConfirmed,
  })
  .transacting(trx);
