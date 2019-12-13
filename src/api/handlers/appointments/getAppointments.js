export default (req, res) => {
    // TODO: Fetch appointments
    const appointments = [
        {
            appointmentId: 1,
            patientName: "Michael Scott",
            patientPhoneNumber: "1-226-555-1234",
            patientLanguage: "english",
            practitionerName: "Dr. Meridith Grey",
            practitionerClinicName: "Grand River Hospital",
            practitionerAddress: "835 King St W, Kitchener",
            practitionerPhoneNumber: "1-226-555-9999",
            appointmentTime: "2020-01-01 12:30:00",
            appointmentIsConfirmed: true
        },
        {
            appointmentId: 1,
            patientName: "Dwtight Schrute",
            patientPhoneNumber: "1-226-555-6660",
            patientLanguage: "english",
            practitionerName: "Dr. Cristina Yang",
            practitionerClinicName: "Grand River Hospital",
            practitionerAddress: "835 King St W, Kitchener",
            practitionerPhoneNumber: "1-226-555-0000",
            appointmentTime: "2020-02-14 11:30:00",
            appointmentIsConfirmed: false
        }
    ];

    // Demo data
    res.status(200).send(appointments);
};
