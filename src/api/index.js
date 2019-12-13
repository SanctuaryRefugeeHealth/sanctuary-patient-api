import { version } from "../../package.json";
import { Router } from "express";
import templates from "./templates";
import {postAppointments} from "./routes/appointments/post";
import { postMessages } from "./routes/messages/post";

export default ({ config, db }) => {
    let api = Router();

    api.use("/templates", templates({ config, db }));

    // perhaps expose some API metadata at the root
    api.get("/", (req, res) => {
        res.json({ version });
    });

    api.post("/appointments", postAppointments);

    api.post("/appointments/:id/messages", postMessages);

    api.get("/ping", (req, res) => {
        res.json("pong");
    });

    return api;
};
