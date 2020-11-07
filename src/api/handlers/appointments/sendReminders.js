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
  let templateId = 1;
  if (appointment.lastReminderSentAt) {
    templateId = 3;
  }
  const template = TemplatesModel.getById(templateId);
  const messageBody = TemplatesModel.generateMessage(
    templateId,
    language.name,
    {
      ...appointment,
      appointmentDate: moment(appointment.appointmentTime).format(
        "dddd, MMMM DD"
      ),
      appointmentTime: moment(appointment.appointmentTime).format("h:mm a"),
    }
  );

  const timeSent = new Date();

  const message = {
    appointmentId: appointment.id,
    messageBody,
    language: language.name,
    templateName: template.templateName,
    timeSent,
  };

  await db.transaction(async (trx) => {
    await trx("messages").insert(message);
    await trx("appointments")
      .update("lastReminderSentAt", timeSent)
      .where("appointmentId", appointment.id);

    await sendMessage(appointment.patientPhoneNumber, messageBody);
  });
};

export const sendReminders = async () => {
  // Select appointments coming up in the next 24 hours that
  // have not had a notification in the previous 24 hours.

  const start = daysFromNow(0);
  const end = daysFromNow(1);
  const notAfter = daysFromNow(-1);

  console.info(
    `Sending reminders for appointments from ${start} to ${end} without reminder after ${notAfter}.`
  );

  const appointments = await db("appointments")
    .select(
      "appointmentId as id",
      "patientName",
      "language",
      "appointmentTime",
      "patientPhoneNumber",
      "practitionerAddress",
      "specialNotes",
      "description",
      "lastReminderSentAt"
    )
    .where("isDeleted", false)
    .whereRaw("`appointmentIsConfirmed` IS NULL OR `appointmentIsConfirmed`")
    .where("appointmentTime", ">=", start)
    .where("appointmentTime", "<", end)
    .andWhere((db) => {
      db.where("lastReminderSentAt", "<=", notAfter).orWhereNull(
        "lastReminderSentAt"
      );
    });

  const promises = appointments.map(sendReminder);

  await Promise.all(promises);
};

export default async (req, res) => {
  try {
    await sendReminders();
    return res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({
      e,
      message: `Could not send reminders for ${daysFromNow(1)}`,
    });
  }
};
