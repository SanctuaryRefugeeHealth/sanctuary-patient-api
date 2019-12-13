const { db } = require("../../../../knex");

export default (req, res) => {
    const { appointmentId } = req.params;

    const { appointmentIsConfirmed } = req.body;

    const result = db("appointments")
        .where({ appointmentId })
        .update({ appointmentIsConfirmed })
        .then(result => {
            res.status(201).send({ success: true });
        });
};
