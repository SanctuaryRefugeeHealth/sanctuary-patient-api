import { Router } from "express";
import { version } from "../../package.json";
import { webhook } from "../services/twilioClient";
import {
  getAppointment,
  getAppointments,
  patchAppointments,
  postAppointments,
  sendReminders,
} from "./handlers/appointments";
import { getToken } from "./handlers/auth";
import { getCommunications } from "./handlers/communications";
import { getLanguages } from "./handlers/languages";
import { getMessages, postMessages } from "./handlers/messages";
import { getMessageTemplates } from "./handlers/templates";
import { postReply } from "./handlers/twilio";
import { createUser } from "./handlers/users";

// eslint-disable-next-line no-unused-vars
export default ({ config }) => {
  let api = Router();

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  // Get an auth token
  api.post("/auth", getToken);

  // -- User
  api.put("/user", createUser);

  api.get("/communications/:appointmentId", getCommunications);

  api.post("/twilio/reply", webhook({ protocol: config.protocol }), postReply);

  // -- Appointments

  api.get("/appointments", getAppointments);
  api.get("/appointments/sendReminders", sendReminders);
  api.get("/appointments/:appointmentId", getAppointment);
  api.post("/appointments", postAppointments);
  api.patch("/appointments/:appointmentId", patchAppointments);

  // -- Messages

  api.get("/appointments/:appointmentId/messages", getMessages);
  api.post("/appointments/:appointmentId/messages", postMessages);

  // -- Message Templates

  api.get("/templates", getMessageTemplates);

  // -- Languages

  api.get("/languages", getLanguages);

  // -- Ping
  api.get("/ping", (req, res) => {
    res.json("pong");
  });

  api.get("/languages", getLanguages);

  return api;
};
