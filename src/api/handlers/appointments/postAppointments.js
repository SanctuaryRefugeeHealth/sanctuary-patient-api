export default (req, res) => {
    const { location, patientName, specialistName, date } = req.body;

    // TODO: create appointment

    res.status(201).send({ success: true });
};
