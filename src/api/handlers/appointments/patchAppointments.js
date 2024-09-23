import { db } from "../../../../knex.js";

export default (req, res) => {
  const { appointmentId } = req.params;
  const { isConfirmed, isDeleted, translator } = req.body;

  return db("appointments")
    .where({ appointmentId })
    .update({ appointmentIsConfirmed: isConfirmed, isDeleted, translator })
    .then(() => res.sendStatus(204));
};
