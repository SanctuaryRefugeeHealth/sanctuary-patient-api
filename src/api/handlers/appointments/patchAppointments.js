const { db } = require("../../../../knex");

export default (req, res) => {
    const { appointmentId } = req.params;

    const { isConfirmed } = req.body;

    const result = db("appointments")
        .where({ appointmentId })
        .update({ appointmentIsConfirmed: isConfirmed })
        .then(result => {
            res.status(201).send({ success: true });
        });
};
