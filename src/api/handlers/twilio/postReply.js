import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";
import { getMessageResponse } from "../../../services/twilioClient";
import {
  getAppointments,
  insertReply,
  confirmAppointment,
  requestTranslator,
} from "./databaseFunctions";

const convertReply = (reply) => {
  const languageConversions = {
    yes: ["نعم", "አዎ", "haa", "Evet", "si", "yes", "እወ"],
    // In spanish and english no is the same
    no: ["لا", "አይ", "maya", "Hayır", "no", "ኣይፋለይን"],
    interpreter: [
      "مترجم",
      "አስተርጓሚ",
      "turjubaan",
      "çevirmen",
      "interprete",
      "interpreter",
      "ኣተርጓሚ"
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
    appointments = await getAppointments(patientPhoneNumber);
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
    switch (formattedMessageFromPatient) {
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
        break;
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

  const replyText = TemplatesModel.generateReply(
    appointments[0].language,
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
