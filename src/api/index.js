import { version } from "../../package.json";
import { Router } from "express";
import templates from "./templates";
import postMessages from "./handlers/messages";
import appointments from "./handlers/appointments";

const { patchAppointments, postAppointments, getAppointments } = appointments;

export default ({ config, db }) => {
    let api = Router();

    api.use("/templates", templates({ config, db }));

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

    return api;
};
