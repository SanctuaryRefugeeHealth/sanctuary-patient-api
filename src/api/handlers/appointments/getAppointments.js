export default (req, res) => {
    console.log(req.body);

    // Demo data
    res.status(200).send([
        {
            appointmentId: 1,
            patientName: "Michael Scott",
            specialistName: "Dr. Meridith Grey",
            date: "2020-02-14 10:00:00",
            location: "Grand River Hospital, 835 King St W, Kitchener"
        },
        {
            appointmentId: 1,
            patientName: "Michael Scott",
            phoneNumber: "1-226-555-1234",
            specialistName: "Dr. Cristina Yang",
            date: "2020-01-08 13:00:00",
            location: "Grand River Hospital, 835 King St W, Kitchener"
        }
    ]);
};
