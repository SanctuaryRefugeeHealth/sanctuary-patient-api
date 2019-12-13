import { sendMessage } from "../../../services/twilioClient"

export default (req, res) => {
    const {From: fromPhoneNumber, Body: message} = req.body;
    const receivedAt = Date.now();
    console.log(fromPhoneNumber, message, receivedAt)
   sendMessage(fromPhoneNumber, 'Thank you for replying!');

    res.send({success: true})
};
