import { version } from "../../package.json";
import { Router } from "express";

import postMessages from "./handlers/messages";
import appointments from "./handlers/appointments";

import getTemplates from "./handlers/templates/get";

const { patchAppointments, postAppointments, getAppointments } = appointments;

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

    // -- Messages

    api.post("/appointments/:appointmentId/messages", postMessages);

    // -- Ping
    api.get("/ping", (req, res) => {
        res.json("pong");
    });

    api.get("/templates", getTemplates);

    return api;
};
