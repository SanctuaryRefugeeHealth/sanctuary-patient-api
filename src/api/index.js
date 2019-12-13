import { version } from "../../package.json";
import { Router } from "express";
import postAppointments from "./routes/appointments/post";
import patchAppointments from "./routes/appointments/patch";
import getTemplates from "./routes/templates/get";

export default ({ config, db }) => {
    let api = Router();

    // perhaps expose some API metadata at the root
    api.get("/", (req, res) => {
        res.json({ version });
    });

    api.post("/appointments", postAppointments);
    api.patch("/appointments/:apointmentId", patchAppointments);

    api.get("/ping", (req, res) => {
        res.json("pong");
    });

    api.get("/templates", getTemplates);

    return api;
};
