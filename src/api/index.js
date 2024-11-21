import { Router } from "express";
import { version } from "../../package.json";
import {
  getAppointment,
  getAppointments,
  patchAppointments,
  postAppointments,
} from "./handlers/appointments";
import { getToken } from "./handlers/auth";
import { getCommunications } from "./handlers/communications";
import { getLanguages } from "./handlers/languages";
import { postReply } from "./handlers/twilio";
import getPatients from "./handlers/patients/getPatients";

// eslint-disable-next-line no-unused-vars
export default ({ config }) => {
  let api = Router();

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  // Get an auth token
  api.post("/auth", getToken);

  api.get("/communications/:appointmentId", getCommunications);

  api.post("/twilio/reply", postReply);

  // -- Appointments
  api.get("/appointments", getAppointments);
  api.get("/appointments/:appointmentId", getAppointment);
  api.post("/appointments", postAppointments);
  api.patch("/appointments/:appointmentId", patchAppointments);

  // -- Patients
  api.get("/patients", getPatients);

  // -- Languages
  api.get("/languages", getLanguages);

  // -- Ping
  api.get("/ping", (req, res) => {
    res.json("pong");
  });

  return api;
};
