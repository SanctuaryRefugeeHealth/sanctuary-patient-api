import { db } from "../../knex";

export async function createAppointment(
  patientName,
  patientPhoneNumber,
  language,
  practitionerAddress,
  appointmentTime,
  description,
  specialNotes
) {
  return db("appointments").insert(
    patientName,
    patientPhoneNumber,
    language,
    practitionerAddress,
    appointmentTime,
    description,
    specialNotes
  );
}
