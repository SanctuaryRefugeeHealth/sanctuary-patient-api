const { db } = require("../../../../knex");

export default (req, res) => {
    const { phoneNumber } = req.query;

    const appointments = db("appointments")
        .select("*")
        .then(result => {
            res.status(200).send(result);
        });
};
