const { db } = require("../../../../knex");

export default (req, res) => {
  const { phoneNumber } = req.query;

  console.log(phoneNumber);

  const appointments = phoneNumber
    ? db("appointments")
        .select("*")
        .where("patientPhoneNumber", phoneNumber)
        .then(result => {
          res.status(200).send(result);
        })
    : db("appointments")
        .select("*")
        .then(result => {
          res.status(200).send(result);
        });
};
