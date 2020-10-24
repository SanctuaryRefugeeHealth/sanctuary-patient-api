import moment from "moment";
import { db } from "../../../../knex";
import LanguagesModel from "../../../models/languages";
import TemplatesModel from "../../../models/templates";
import { sendMessage } from "../../../services/twilioClient";

const daysFromNow = (interval) => {
  return moment().add(interval, "d").format("YYYY-MM-DD hh:mm:ss");
};

export const sendReminder = async (appointment) => {
  console.log(`Sending reminder for appointment ${appointment.id}`);

  const language = await LanguagesModel.getByLanguageString(
    appointment.language
  );
  const template = TemplatesModel.getById(1);
  const messageBody = TemplatesModel.generateMessage(1, language.name, {
    ...appointment,
    appointmentDateTime: moment(appointment.appointmentTime).format(
      "YYYY-MM-DD h:mm a"
    ),
    appointmentDate: moment(appointment.appointmentTime).format("YYYY-MM-DD"),
    appointmentTime: moment(appointment.appointmentTime).format("h:mm a"),
  });

  const timeSent = new Date();

  const message = {
    appointmentId: appointment.id,
    messageBody,
    language: language.name,
    templateName: template.templateName,
    timeSent,
  };

  await sendMessage(appointment.patientPhoneNumber, messageBody);
  await db("messages").insert(message);
  await db("appointments")
    .update("lastReminderSentAt", timeSent)
    .where("appointmentId", appointment.id);
};

export const sendReminders = async () => {
  // Select appointments coming up in the next 24 hours that
  // have not had a notification in the previous 24 hours.
  const appointments = await db("appointments")
    .select(
      "appointmentId as id",
      "language",
      "appointmentTime",
      "patientPhoneNumber",
      "practitionerAddress",
      "specialNotes",
      "description"
    )
    .where("isDeleted", false)
    .where("lastReminderSentAt", "<=", daysFromNow(-1))
    .orWhereNull("lastReminderSentAt")
    .where("appointmentTime", ">=", daysFromNow(0))
    .where("appointmentTime", "<", daysFromNow(1));

  const promises = appointments.map(sendReminder);

  return await Promise.all(promises);
};

export default async (req, res) => {
  try {
    const results = await sendReminders();
    res.status(200).send(results);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      e,
      message: `Could not send reminders for ${daysFromNow(1)}`,
    });
  }
};
