import { db } from "../../../../knex";

const appointmentFields = [
  "appointmentId",
  "patientName",
  "patientPhoneNumber",
  "practitionerName",
  "practitionerClinicName",
  "practitionerAddress",
  "practitionerPhoneNumber",
  "appointmentTime",
  "appointmentIsConfirmed",
  "isDeleted",
  { patientLanguage: "language" },
];

export function getAppointments(req, res) {
  const { phoneNumber } = req.query;

  return phoneNumber
    ? db("appointments")
        .select(appointmentFields)
        .where({ patientPhoneNumber: phoneNumber, isDeleted: false })
        .then((result) => {
          res.status(200).send(result);
        })
    : db("appointments")
        .select(appointmentFields)
        .where("isDeleted", false)
        .then((result) => {
          res.status(200).send(result);
        });
}

export async function getAppointment(req, res) {
  const { appointmentId } = req.params;

  return db("appointments")
    .select(appointmentFields)
    .where({ appointmentId: appointmentId, isDeleted: false })
    .first()
    .then((result) => {
      if (result) {
        return res.status(200).json(result);
      }
      return res.status(404).end();
}
