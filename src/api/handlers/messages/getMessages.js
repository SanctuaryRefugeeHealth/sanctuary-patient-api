import { db } from "../../../../knex";

export default (req, res) => {
  const { appointmentId } = req.params;

  db("messages")
    .select("*")
    .where("appointmentId", appointmentId)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
