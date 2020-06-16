import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";
import { sendMessage } from "../../../services/twilioClient";

const handleError = async (fromPhoneNumber, appointmentId = null) => {
  try {
    await sendMessage(fromPhoneNumber, "Thank you for replying!");
  } catch (error) {
    console.log(`Error sending message to patient. ${{fromPhoneNumber, appointmentId, error}}`);
    return Promise.resolve();
  }
  return Promise.resolve();
}

export default async (req, res) => {
  const {From: fromPhoneNumber, Body: message} = req.body;
  const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let appointment;
  try {
    appointment = await db("appointments")
      .select(
        "appointmentId",
        "appointmentTime",
        "patientName",
        "patientPhoneNumber",
        "practitionerAddress",
        "practitionerClinicName",
        "patientLanguage"
      )
      .where({ "patientPhoneNumber": fromPhoneNumber, "isDeleted": false })
      .first();
  } catch (error) {
    console.log(`Error sending reply ${error}`);
    return handleError(fromPhoneNumber);
  }

  if (!appointment) {
    return handleError(fromPhoneNumber);
  }

  try {
    await db("replies")
      .insert({
        phoneNumber: fromPhoneNumber, 
        body: message,
        appointmentId: appointment.appointmentId, 
        time: currentDateTime
      });
  } catch (error) {
    console.log(`Error saving reply ${error}`);
    return handleError(fromPhoneNumber, appointment.appointmentId);
  }

  const messageBody = TemplatesModel.generateReply(2, appointment.patientLanguage);

  try {
    await sendMessage(appointment.patientPhoneNumber, messageBody);
  } catch (error) {
    console.log(`Error saving reply ${error}`);
    return handleError(fromPhoneNumber, appointment.appointmentId);
  }

  try {
    await db("messages").insert({
      appointmentId: appointment.appointmentId,
      messageBody,
      timeSent: currentDateTime,
      language: appointment.patientLanguage
    });
  } catch (error) {
    console.log(`Error saving reply ${error}`);
    return handleError(fromPhoneNumber, appointment.appointmentId);
  }

  return res.status(200).send({success: true});
};
