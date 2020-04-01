import postAppointments from "./postAppointments";
import patchAppointments from "./patchAppointments";
import getAppointments from "./getAppointments";
import sendReminders from "./sendReminders";

const appointments = { 
  postAppointments, 
  patchAppointments, 
  getAppointments,
  sendReminders
};

export default appointments;
