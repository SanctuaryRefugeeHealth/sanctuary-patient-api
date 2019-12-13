export default (req, res) => {
    const { message } = req.body;
    const { phoneNumber } = req.params;
    console.log(message, phoneNumber);

    res.send({ success: true });
};
