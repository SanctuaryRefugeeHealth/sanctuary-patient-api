import { Router } from "express";
import { version } from "../../package.json";
import appointments from "./handlers/appointments";
import auth from "./handlers/auth";
import languages from "./handlers/languages";
import messages from "./handlers/messages";
import replies from "./handlers/replies";
import messageTemplates from "./handlers/templates";


const { patchAppointments, postAppointments, getAppointments } = appointments;
const { getMessages, postMessages } = messages;
const { postReplies } = replies;
const { getLanguages } = languages;
const { getMessageTemplates } = messageTemplates;
const { getToken, authenticate } = auth;

// eslint-disable-next-line no-unused-vars
export default ({ config, db }) => {
    let api = Router();

    // perhaps expose some API metadata at the root
    api.get("/", (req, res) => {
        res.json({ version });
    });


    // Get an auth token
    // To protect the route, add middleware 'authenticate'
    api.post("/auth", getToken);

    // -- Appointments

    api.get("/appointments", authenticate, getAppointments);
    api.post("/appointments", authenticate, postAppointments);
    api.patch("/appointments/:appointmentId", authenticate, patchAppointments);

    // -- Messages

    api.get("/appointments/:appointmentId/messages", authenticate, getMessages);
    api.post("/appointments/:appointmentId/messages", authenticate, postMessages);

    // -- Message Templates

    api.get("/templates", authenticate, getMessageTemplates);

    // -- Replies

    api.post("/reply/:phoneNumber", authenticate, postReplies);

    // -- Languages

    api.get("/languages", authenticate, getLanguages);

    // -- Ping
    api.get("/ping", (req, res) => {
        res.json("pong");
    });

    api.post("/reply", authenticate, postReplies);
    api.get("/languages", authenticate, getLanguages);

    return api;
};
