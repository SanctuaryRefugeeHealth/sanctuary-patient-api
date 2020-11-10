import { db } from "../../knex";

export async function createAppointment(appointment) {
  return db("appointments").insert(appointment);
}
