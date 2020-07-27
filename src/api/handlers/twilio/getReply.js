import { getMessageResponse } from "../../../services/twilioClient";

export default (req, res) => {
  console.log("Enter");
  const reply = getMessageResponse();

  console.log("Reply: ", reply);

  res.set("Content-Type", "text/xml");
  res.send(reply);
};
