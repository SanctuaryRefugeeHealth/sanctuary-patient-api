import moment from "moment";

import { db } from "../../../../knex";
import { sendMessage } from "../../../services/twilioClient";
import TemplatesModel from "../../../models/templates";
import LanguagesModel from "../../../models/languages";

const daysFromNow = (interval) => {
  return moment().add(interval, "d").format("YYYY-MM-DD hh:mm:ss");
};

export default async (req, res) => {
  let appointments;
  try {
    appointments = await db("appointments")
      .select("*")
      .where("appointmentTime", ">=", daysFromNow(1))
      .where("appointmentTime", "<", daysFromNow(2));
  } catch (error) {
    res.status(500).send({
      error,
      message: `Could not retrieve appointments for ${daysFromNow(2)}`
    });
  }

  const appointmentsPromises = appointments.map(appointment => {
    const language = LanguagesModel.getByLanguageString(appointment.patientLanguage);
    // 1 is reminder template ID
    const messageBody = TemplatesModel.generateMessage(1, language.id, appointment);

    return new Promise((resolve) => {
      sendMessage(appointment.patientPhoneNumber, messageBody)
        .then(() => resolve(appointment))
        // TODO: don't resolve this, send it to a log aggregator
        .catch((error) => resolve({
            error,
            appointmentId: appointment.id
          })
        );
    });
  });

  Promise.all(appointmentsPromises)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send({ 
        error,
        message: `Could not send reminders for ${daysFromNow(7)}`
      })
    );
};
