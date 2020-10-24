var CronJob = require("cron").CronJob;

import { sendReminders } from "../api/handlers/appointments/sendReminders";
import config from "../config";

const tz = config.scheduler.timezone;

module.exports = new CronJob(
  config.scheduler.cron,
  async () => {
    console.info(`Running Send Notifications Worker ${new Date()}`);
    await sendReminders();
  },
  null,
  true,
  tz
);
