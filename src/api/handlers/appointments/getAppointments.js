import { db } from "../../../../knex";

export function getAppointments (req, res) {
  const { phoneNumber } = req.query;

  return phoneNumber
    ? db("appointments")
        .select("*")
        .where({ "patientPhoneNumber": phoneNumber, "isDeleted": false })
        .then(result => {
          res.status(200).send(result);
        })
    : db("appointments")
        .select("*")
        .where("isDeleted", false)
        .then(result => {
          res.status(200).send(result);
        });
}

export async function getAppointment(req, res) {
  const { appointmentId } = req.params;

  return db("appointments")
    .select("*")
    .where({ "appointmentId": appointmentId, "isDeleted": false })
    .first()
    .then((result) => {
      // We need a presentation layer.
      return res.status(200).send(result)
    })
}
