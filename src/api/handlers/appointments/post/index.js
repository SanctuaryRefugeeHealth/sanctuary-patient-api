export default (req, res) => {
    const {location, patientName, specialistName, date} = req.body;
    console.log(location, patientName, specialistName, date);
    res.status(201).send({success: true});
}
