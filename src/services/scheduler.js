var CronJob = require("cron").CronJob;
import moment from "moment-timezone";

import config from "../config";
import { db } from "../../knex";

const tz = config.scheduler.timezone;

const sendReminder = (appointmentId) => {
  console.log(`Send reminder for appointment ${appointmentId}`);
};

const sendReminders = async (start, end) => {
  const appointments = await db("appointments")
    .select(["appointmentId"])
    .whereBetween("appointmentTime", [start, end]);

  appointments.forEach((appointment) => {
    sendReminder(appointment.appointmentId);
  });
};

module.exports = new CronJob(
  config.scheduler.cron,
  async () => {
    const start = moment().tz(tz).format();
    console.info(`Running Send Notifications Worker for ${start}`);

    const end = moment(start)
      .tz(tz)
      .add(1, "day")
      .subtract(1, "minute")
      .format();

    await sendReminders(start, end);
  },
  null,
  true,
  tz
);
