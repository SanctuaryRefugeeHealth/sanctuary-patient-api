import { version } from "../../package.json";
import { Router } from "express";

import messages from "./handlers/messages";
import appointments from "./handlers/appointments";
import replies from "./handlers/replies";
import languages from "./handlers/languages";
import messageTemplates from "./handlers/templates";

const { 
  patchAppointments, 
  postAppointments, 
  getAppointments,
  sendReminders
} = appointments;
const { getMessages, postMessages } = messages;
const { postReplies } = replies;
const { getLanguages } = languages;
const { getMessageTemplates } = messageTemplates;

// eslint-disable-next-line no-unused-vars
export default ({ config, db }) => {
  let api = Router();

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  // -- Appointments

  api.get("/appointments", getAppointments);
  api.post("/appointments", postAppointments);
  api.patch("/appointments/:appointmentId", patchAppointments);

  // -- Bulk messages

  api.get("/appointments/sendReminders", sendReminders);

  // -- Messages

  api.get("/appointments/:appointmentId/messages", getMessages);
  api.post("/appointments/:appointmentId/messages", postMessages);

  // -- Message Templates

  api.get("/templates", getMessageTemplates);

  // -- Replies

  api.post("/reply/:phoneNumber", postReplies);

  // -- Languages

  api.get("/languages", getLanguages);

  // -- Ping
  api.get("/ping", (req, res) => {
      res.json("pong");
  });

  api.post("/reply", postReplies);
  api.get("/languages", getLanguages);

  return api;
};
