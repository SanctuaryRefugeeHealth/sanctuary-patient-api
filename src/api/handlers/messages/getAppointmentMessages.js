export default (req, res) => {
    console.log(req.body);

    // Demo data
    res.status(200).send([
        {
            messageId: 1,
            appointmentId: 1,
            templateId: 1,
            languageId: 1,
            content: "Hello World"
        },
        {
            messageId: 2,
            appointmentId: 1,
            templateId: 1,
            languageId: 1,
            content: "Hello World"
        }
    ]);
};
