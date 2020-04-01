import moment from "moment";
import { db } from "../../../../knex";
import TemplatesModel from "../../../models/templates";
import { sendMessage } from "../../../services/twilioClient";

export default async (req, res) => {
  const { appointmentId } = req.params;

  const { templateId, languageId } = req.body;
  
  let appointment;
  try {
    appointment = await db("appointments")
      .select(
        "appointmentTime",
        "patientName",
        "patientPhoneNumber",
        "practitionerAddress",
        "practitionerClinicName"
      )
      .where("appointmentId", appointmentId)
      .first()
      .then(result => result);
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not retrieve appointment for ID ${appointmentId}`
    });
    return;
  }

  if (!appointment) {
    res.status(404).send({
      message: `No appointment found for ID ${appointmentId}`
    });
    return;
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
    await sendMessage(appointment.patientPhoneNumber, messageBody);
  } catch (error) {
    res.status(500).send({
      error,
      message: "Could not send text reminder"
    });
    return;
  }

  try {
    db("messages")
      .insert(message)
      .then(() => {
        res.status(201).send(message);
      })
  } catch (error) {
    res.status(500).send({
      error,
      message: "Could not save message to database"
    });
    return;
  }
};
