import { db } from "../../../../knex";

export default (req, res) => {
  const {
    date,
    location,
    patientLanguage,
    patientName,
    practitionerClinicName,
    patientPhoneNumber,
    practitionerPhoneNumber,
    specialistName
  } = req.body;

  const appointment = {
    patientName,
    patientPhoneNumber,
    patientLanguage,
    practitionerName: specialistName,
    practitionerClinicName,
    practitionerAddress: location,
    practitionerPhoneNumber,
    appointmentTime: date,
    appointmentIsConfirmed: false
  };

  db("appointments")
  .insert(appointment)
  .then(result => {
    res.status(201).send(result);
  });
};
