import { db } from "../../../../knex";

export const getRepliesFromDb = (appointmentId) => {
  return db("replies")
    .select("*")
    .where("appointmentId", appointmentId);
}

export const getReplies = (req, res) => {
  const { appointmentId } = req.params;

  return getRepliesFromDb(appointmentId)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
};
