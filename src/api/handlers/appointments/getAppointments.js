import {
  getAppointment as getAppt,
  getAppointments as getAppts,
} from "../../../models/appointments.js";

export async function getAppointments(req, res) {
  const { phoneNumber } = req.query;

  const appointments = await getAppts(phoneNumber);

  return res.status(200).send(appointments);
}

export async function getAppointment(req, res) {
  const { appointmentId } = req.params;

  const appointment = await getAppt(appointmentId);

  if (appointment) {
    return res.status(200).send(appointment);
  }
  return res.status(404).end();
}
