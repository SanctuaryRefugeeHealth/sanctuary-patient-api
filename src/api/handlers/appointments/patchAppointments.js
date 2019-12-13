export default (req, res) => {
    const { appointmentId } = req.params;

    const { confirmed } = req.body;

    // TODO: update appointment

    res.status(200).send({ success: true });
};
