import { db } from "../../knex";

export const getReplies = (appointmentId) => {
  return db("replies").select("*").where("appointmentId", appointmentId);
};

export const getMessages = (appointmentId) => {
  return db("messages").select("*").where("appointmentId", appointmentId);
};

export const insertReply = (
  trx,
  patientPhoneNumber,
  messageFromPatient,
  appointmentId
) => {
  return trx("replies")
    .insert({
      phoneNumber: patientPhoneNumber,
      body: messageFromPatient,
      appointmentId,
      time: new Date(),
    });
};
