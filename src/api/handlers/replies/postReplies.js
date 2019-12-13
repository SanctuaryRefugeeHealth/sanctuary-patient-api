export default (req, res) => {
    const { phoneNumber } = req.params;

    const { message } = req.body;

    // TODO: Create reply

    res.send({ success: true });
};
