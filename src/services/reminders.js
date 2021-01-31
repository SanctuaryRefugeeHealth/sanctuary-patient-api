import moment from "moment-timezone";
import { db } from "../../knex";
import {
  getAppointments,
  updateLastReminderSentAt,
} from "../models/appointments";
import { createMessage } from "../models/communications";
import TemplatesModel from "../models/templates";
import { sendMessage } from "./twilioClient";
import config from "../config";

const daysFromNow = (interval) => {
  return moment()
    .tz(config.scheduler.timezone)
    .add(interval, "d")
    .format("YYYY-MM-DD HH:mm:ss");
};

export const sendReminder = async (appointment) => {
  console.info(`Sending reminder for appointment ${appointment.appointmentId}`);

  if (!appointment.appointmentTime) {
    throw Error("appointmentTime is required.");
  }

  const templateId = 1;
  const messageBody = TemplatesModel.generateMessage(
    templateId,
    appointment.language,
    {
      ...appointment,
      includeReplySection: appointment.appointmentIsConfirmed === null,
      appointmentDate: moment(appointment.appointmentTime).format(
        "dddd, MMMM DD"
      ),
      appointmentTime: moment(appointment.appointmentTime).format("h:mm a"),
    }
  );

  const timeSent = new Date();

  const message = {
    appointmentId: appointment.appointmentId,
    messageBody,
    language: appointment.language,
    templateName: TemplatesModel.getById(templateId).templateName,
    timeSent,
  };

  await db.transaction(async (trx) => {
    await createMessage(trx, message);
    await updateLastReminderSentAt(trx, appointment.appointmentId, timeSent);

    await sendMessage(appointment.patientPhoneNumber, messageBody);
  });

  return message;
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

  const appointments = await getAppointments()
    .andWhere((db) => {
      db.where("appointmentIsConfirmed", true).orWhereNull(
        "appointmentIsConfirmed"
      );
    })
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
