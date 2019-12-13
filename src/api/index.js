import { version } from "../../package.json";
import { Router } from "express";

import messages from "./handlers/messages";
import appointments from "./handlers/appointments";
import replies from "./handlers/replies";
import templates from "./handlers/templates";
import languages from "./handlers/languages";

const { patchAppointments, postAppointments, getAppointments } = appointments;
const { getMessages, postMessages } = messages;
const { postReplies } = replies;
const { getTemplates } = templates;
const { getLanguages } = languages;

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

    api.get("/appointments/:appointmentId/messages", getMessages);
    api.post("/appointments/:appointmentId/messages", postMessages);

    // -- Ping
    api.get("/ping", (req, res) => {
        res.json("pong");
    });

    api.get("/templates", getTemplates);
    api.post("/reply/:phoneNumber", postReplies);
    api.get("/languages", getLanguages);

    return api;
};
