export default (req, res) => {
    const { appointmentId } = req.params;
    const { templateId, languageId } = req.body;
    console.log({ appointmentId, templateId, languageId });

    // Send sms message

    res.send({ success: true });
};
