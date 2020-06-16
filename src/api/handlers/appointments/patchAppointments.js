import { db } from "../../../../knex";

export default (req, res) => {
  const { appointmentId } = req.params;
  const { isConfirmed, isDeleted } = req.body;

  return db("appointments")
    .where({ appointmentId })
    .update({ appointmentIsConfirmed: isConfirmed, isDeleted })
    .then(() => res.sendStatus(204));
};
