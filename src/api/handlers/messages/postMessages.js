import moment from "moment";

import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";

export default async (req, res) => {
  const { appointmentId } = req.params;

  const { templateId, languageId } = req.body;
  
  let appointment;
  try {
    appointment = await db("appointments")
    .select(
      "appointmentTime",
      "patientName",
      "practitionerAddress",
      "practitionerClinicName"
    )
    .where("appointmentId", appointmentId)
    .first()
    .then(result => result);
  } catch (err) {
    res.status(500).send(err);
  }

  const template = TemplatesModel.getById(templateId);
  const messageBody = TemplatesModel.generateMessage(templateId, languageId, appointment);

  const message = {
    appointmentId,
    messageBody,
    language: languageId,
    templateName: template.templateName,
    // UTC
    timeSent: moment().format("YYYY-MM-DD HH:mm:ss")
  };

  try {
    db("messages")
    .insert(message)
    .then(() => {
      res.status(201).send(message);
    })
  } catch (err) {
    res.status(500).send(err);
  }

  // TODO: Send sms message
  // Not sure if we want to create a transation and only commit once we get confirmation from twilio
  // Or write the message to the DB and include a "successful" field, updating after twilio response
};
