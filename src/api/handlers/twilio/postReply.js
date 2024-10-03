import { db } from "../../../../knex.js";
import TemplatesModel from "../../../models/templates.js";
import { getMessageResponse } from "../../../services/twilioClient.js";
import { insertReply } from "../../../models/communications.js";
import {
  getAppointments,
  confirmAppointment,
  requestTranslator,
} from "../../../models/appointments.js";

const convertReply = (reply) => {
  const languageConversions = {
    yes: ["نعم", "አዎ", "haa", "evet", "si", "yes", "እወ"],
    // In spanish and english no is the same
    no: ["لا", "አይ", "maya", "hayır", "no", "ኣይፋለይን"],
    interpreter: [
      "مترجم",
      "አስተርጓሚ",
      "turjubaan",
      "çevirmen",
      "interprete",
      "interpreter",
      "ኣተርጓሚ",
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

export async function handlePostReply(patientPhoneNumber, messageFromPatient) {
  let ourResponse;

  if (!messageFromPatient || messageFromPatient === "") {
    ourResponse = getMessageResponse(
      'This system only understands "yes", "no", and "interpreter". For anything else, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.'
    );
    return ourResponse;
  }

  const formattedMessageFromPatient = messageFromPatient.toLowerCase().trim();

  const convertedReply = convertReply(formattedMessageFromPatient);
  if (!convertedReply) {
    ourResponse = getMessageResponse(
      'This system only understands "yes", "no", and "interpreter". For anything else, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.'
    );
    return ourResponse;
  }

  let appointments;
  try {
    appointments = await getAppointments(patientPhoneNumber).orderBy(
      "appointmentId",
      "desc"
    );
  } catch (error) {
    console.log(`Could not get appointment for ${patientPhoneNumber}`, error);
    // Can't store reply without appointmentId
    ourResponse = getMessageResponse(
      "We are sorry, our automated system could not find your appointment. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return ourResponse;
  }

  if (!appointments || appointments.length === 0) {
    ourResponse = getMessageResponse(
      "We are sorry, our automated system could not find your appointment. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return ourResponse;
  }

  const trx = await db.transaction();
  try {
    switch (convertedReply) {
      case "yes":
        for (const appointment of appointments) {
          await insertReply(
            trx,
            patientPhoneNumber,
            messageFromPatient,
            appointment.appointmentId
          );
          await confirmAppointment(trx, appointment.appointmentId, true);
        }
        break;
      case "no":
        for (const appointment of appointments) {
          await insertReply(
            trx,
            patientPhoneNumber,
            messageFromPatient,
            appointment.appointmentId
          );
          await confirmAppointment(trx, appointment.appointmentId, false);
        }
        break;
      case "interpreter":
        for (const appointment of appointments) {
          await insertReply(
            trx,
            patientPhoneNumber,
            messageFromPatient,
            appointment.appointmentId
          );
          await requestTranslator(trx, appointment.appointmentId, true);
        }
        break;
      default:
        throw Error("Unknown reply.");
    }
  } catch (error) {
    await trx.rollback();
    console.log(
      `There was an error handling a reply ${patientPhoneNumber}, ${messageFromPatient}, ${appointments}`,
      error
    );
    ourResponse = getMessageResponse(
      "We are sorry, we could not confirm your appointment. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
    return ourResponse;
  }

  await trx.commit();

  const mostRecentPatientLanguage = appointments[0].language;

  const replyText = TemplatesModel.generateReply(
    mostRecentPatientLanguage,
    convertReply(convertedReply)
  );

  ourResponse = getMessageResponse(replyText);
  return ourResponse;
}

export async function postReply(req, res) {
  let patientPhoneNumber = req && req.body && req.body.From;
  const messageFromPatient = req && req.body && req.body.Body;

  patientPhoneNumber = patientPhoneNumber.replace("+", "");
  patientPhoneNumber = patientPhoneNumber.substring(1);
  res.set("Content-Type", "text/xml");
  let ourResponse;

  try {
    ourResponse = await handlePostReply(patientPhoneNumber, messageFromPatient);
  } catch (error) {
    console.log(
      `There was an error handling a reply ${patientPhoneNumber}, ${messageFromPatient}`,
      error
    );
    ourResponse = getMessageResponse(
      "We are sorry, we could not confirm your appointment. Please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321"
    );
  }

  return res.send(ourResponse);
}
