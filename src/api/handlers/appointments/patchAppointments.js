import { db } from "../../../../knex";

export default (req, res) => {
  const { appointmentId } = req.params;

  const { isConfirmed } = req.body;

  db("appointments")
    .where({ appointmentId })
    .update({ appointmentIsConfirmed: isConfirmed })
    .then(result => {
      res.status(201).send(result);
    });
};
