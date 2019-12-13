export default (req, res) => {
    const {confirmed}  = req.body;
    const appointmentId = req.params;
    console.log(confirmed, appointmentId);
    res.status(200).send({ success: true });
};
