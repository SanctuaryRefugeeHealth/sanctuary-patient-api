import { Router } from "express";
import { webhook } from "../services/twilioClient.js";
import {
  getAppointment,
  getAppointments,
  patchAppointments,
  postAppointments,
} from "./handlers/appointments/index.js";
import { getToken } from "./handlers/auth/index.js";
import { getCommunications } from "./handlers/communications/index.js";
import { getLanguages } from "./handlers/languages/index.js";
import { postReply } from "./handlers/twilio/index.js";
import { protocol } from "../config.js";

// eslint-disable-next-line no-unused-vars
export default () => {
  let api = Router();

  // Get an auth token
  api.post("/auth", getToken);

  api.get("/communications/:appointmentId", getCommunications);

  api.post("/twilio/reply", webhook({ protocol }), postReply);

  // Appointments
  api.get("/appointments", getAppointments);
  api.get("/appointments/:appointmentId", getAppointment);
  api.post("/appointments", postAppointments);
  api.patch("/appointments/:appointmentId", patchAppointments);

  // -- Languages
  api.get("/languages", getLanguages);

  // -- Ping
  api.get("/ping", (req, res) => {
    res.json("pong");
  });

  return api;
};
