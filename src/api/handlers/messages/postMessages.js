export default (req, res) => {
    const { appointmentId } = req.params;

    const { templateId, languageId } = req.body;

    // TODO: Create a message
    // TODO: Send sms message

    res.send({ success: true });
};
