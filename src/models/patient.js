import { db } from "../../knex";

const patientFields = [
  "patientName",
  "patientPhoneNumber",
  "language",
  { patientLanguage: "language" },
];

export const getPatients = (substring) => {
  const query = db("appointments")
    .distinct(patientFields)
    .where("patientName", "like", `%${substring}%`);

  return query;
};
