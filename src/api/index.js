import { version } from "../../package.json";
import { Router } from "express";
import templates from "./templates";
import postAppointments from "./handlers/appointments/post";
import postMessages from "./handlers/messages/post";
import patchAppointments from "./handlers/appointments/patch";

export default ({ config, db }) => {
    let api = Router();

    api.use("/templates", templates({ config, db }));

    // perhaps expose some API metadata at the root
    api.get("/", (req, res) => {
        res.json({ version });
    });

    api.post("/appointments", postAppointments);

    api.post("/appointments/:appointmentId/messages", postMessages);
    api.patch("/appointments/:appointmentId", patchAppointments);

    api.get("/ping", (req, res) => {
        res.json("pong");
    });

    return api;
};
