import moment from "moment";
import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";
import { getMessageResponse } from "../../../services/twilioClient";

const convertReply = (reply) => {
  const languageConversions = {
    yes: ["نعم", "አዎ", "haa", "Evet", "si", "yes"],
    // In spanish and english no is the same
    no: ["لا", "አይ", "maya", "Hayır", "no"],
    interpreter: [
      "مترجم",
      "አስተርጓሚ",
      "turjubaan",
      "çevirmen",
      "interprete",
      "interpreter",
    ],
  };
  let convertedReply;

  for (let key of Object.keys(languageConversions)) {
    if (languageConversions[key].includes(reply)) {
      convertedReply = key;
      break;
    }
  }

  return convertedReply;
};

export default async (req, res) => {
  let patientPhoneNumber = req?.body?.From;
  const messageFromPatient = req?.body?.Body;
  const lowercaseMessageFromPatient = messageFromPatient.toLowerCase();
  let ourResponse;
  patientPhoneNumber = patientPhoneNumber.replace("+", "");
  patientPhoneNumber = patientPhoneNumber.substring(1);
  res.set("Content-Type", "text/xml");

  if (!messageFromPatient || messageFromPatient === "") {
    ourResponse = getMessageResponse(
      "We are sorry, we could not process your response. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return res.send(ourResponse);
  }

  let appointments;
  try {
    appointments = await db("appointments")
      .select("appointmentId", "language")
      .where({ patientPhoneNumber, appointmentIsConfirmed: 0 });
  } catch (error) {
    // Can't store reply without patientId
    ourResponse = getMessageResponse(
      "We are sorry, we could not find an appointment for you. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return res.send(ourResponse);
  }

  if (!appointments) {
    ourResponse = getMessageResponse(
      "We are sorry, we could not find an appointment for you. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return res.send(ourResponse);
  }

  const trx = await db.transaction();
  const convertedReply = convertReply(lowercaseMessageFromPatient);

  if (!convertedReply) {
    ourResponse = getMessageResponse(
      "We are sorry, we could not confirm your appointment. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return res.send(ourResponse);
  }

  try {
    switch (lowercaseMessageFromPatient) {
      case "yes":
        for (const appointment of appointments) {
          await db("replies")
            .insert({
              phoneNumber: patientPhoneNumber,
              body: messageFromPatient,
              appointmentId: appointment.appointmentId,
              time: moment().format("YYYY-MM-DD HH:mm:ss"),
            })
            .transacting(trx);
          await db("appointments")
            .where({ appointmentId: appointment.appointmentId })
            .update({
              appointmentIsConfirmed: 1,
            })
            .transacting(trx);
        }
        break;
      case "no":
        for (const appointment of appointments) {
          await db("replies")
            .insert({
              phoneNumber: patientPhoneNumber,
              body: messageFromPatient,
              appointmentId: appointment.appointmentId,
              time: moment().format("YYYY-MM-DD HH:mm:ss"),
            })
            .transacting(trx);
          await db("appointments")
            .where({ appointmentId: appointment.appointmentId })
            .update({
              appointmentIsConfirmed: 0,
            })
            .transacting(trx);
        }
        break;
      // Handle interpreter?
      default:
        break;
    }
  } catch (error) {
    await trx.rollback();
    ourResponse = getMessageResponse(
      "We are sorry, we could not confirm your appointment. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return res.send(ourResponse);
  }

  await trx.commit();

  const replyText = TemplatesModel.generateReply(
    appointments[0].language,
    convertReply(convertedReply)
  );

  ourResponse = getMessageResponse(replyText);

  return res.send(ourResponse);
};
