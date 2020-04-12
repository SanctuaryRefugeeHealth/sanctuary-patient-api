import { db } from "../../../../knex";

export default (req, res) => {
  const { appointmentId } = req.params;

  const { isConfirmed } = req.body;

  return db("appointments")
    .where({ appointmentId })
    .update({ appointmentIsConfirmed: isConfirmed })
    .then(() => res.sendStatus(204));
};
