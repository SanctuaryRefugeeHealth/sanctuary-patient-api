export default (req, res) => {
    console.log(req.body);

    // Demo data
    res.status(200).send([
        {
            messageId: 1,
            appointmentId: 1,
            templateName: "Appointment Confirmation",
            messageBody: "Hello World",
            timeSent: "2019-12-13 14:10:00",
            language: "english"
        },
        {
            messageId: 1,
            appointmentId: 1,
            templateName: "Additional Information",
            messageBody: "Please call (226) 123-4567 for more details",
            timeSent: "2019-12-13 14:10:00",
            language: "arabic"
        }
    ]);
};
