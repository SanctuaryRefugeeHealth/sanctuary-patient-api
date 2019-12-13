const { db } = require("../../../db");

export default (req, res) => {
    const { phoneNumber } = req.query;

    const appointments = patientPhoneNumber
        ? db("appointments")
              .select("*")
              .where("patientPhoneNumber", phoneNumber)
              .execute()
        : db("appointments")
              .select("*")
              .execute();

    res.status(200).send(appointments);
};
