import { Router } from "express";
import { version } from "../../package.json";
import appointments from "./handlers/appointments";
import auth from "./handlers/auth";
import languages from "./handlers/languages";
import messages from "./handlers/messages";
import replies from "./handlers/replies";
import messageTemplates from "./handlers/templates";
import user from "./handlers/users";

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
const { getToken } = auth;
const { createUser } = user;

// eslint-disable-next-line no-unused-vars
export default ({ config, db }) => {
  let api = Router();

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  // Get an auth token
  api.post("/auth", getToken);

  // -- User
  api.put("/user", createUser);

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
