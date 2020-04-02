import { Router } from "express";
import { version } from "../../package.json";
import { getAppointments, patchAppointments, postAppointments } from "./handlers/appointments";
import { getToken } from "./handlers/auth";
import { getLanguages } from "./handlers/languages";
import { getMessages, postMessages } from "./handlers/messages";
import { postReplies } from "./handlers/replies";
import { getMessageTemplates } from "./handlers/templates";

// eslint-disable-next-line no-unused-vars
export default ({ config, db }) => {
    let api = Router();

    // perhaps expose some API metadata at the root
    api.get("/", (req, res) => {
        res.json({ version });
    });

    // Begin unprotected routes
    // Get auth token for user
    api.post("/auth", getToken);
     // -- Ping
    api.get("/ping", (req, res) => {
        res.json("pong");
    });
    // End unprotected routes


    // -- Appointments

    api.get("/appointments", getAppointments);
    api.post("/appointments", postAppointments);
    api.patch("/appointments/:appointmentId", patchAppointments);

    // -- Messages

    api.get("/appointments/:appointmentId/messages", getMessages);
    api.post("/appointments/:appointmentId/messages", postMessages);

    // -- Message Templates

    api.get("/templates", getMessageTemplates);

    // -- Replies

    api.post("/reply/:phoneNumber", postReplies);

    // -- Languages

    api.get("/languages", getLanguages);
    
    api.post("/reply", postReplies);
    api.get("/languages", getLanguages);

    return api;
};
