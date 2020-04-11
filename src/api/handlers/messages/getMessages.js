import { db } from "../../../../knex";

export default (req, res) => {
  const { appointmentId } = req.params;

  return db("messages")
    .select("*")
    .where("appointmentId", appointmentId)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};
