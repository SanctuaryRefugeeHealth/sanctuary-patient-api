import { CronJob } from "cron";
import { sendReminders } from "../services/reminders.js";
import { scheduler } from "../config.js";

const tz = scheduler.timezone;

const job = new CronJob(
  scheduler.cron,
  async () => {
    console.info(`Running Send Notifications Worker ${new Date()}`);
    await sendReminders();
  },
  null,
  true,
  tz
);

export default job;
