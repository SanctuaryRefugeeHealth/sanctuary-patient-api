import TemplatesModel from "../../../models/templates";
import { getMessageResponse } from "../../../services/twilioClient";

export default (req, res) => {
  console.log("Enter");

  const language = "English";

  const replyText = TemplatesModel.generateReply(language);

  const reply = getMessageResponse(replyText);

  console.log("Reply: ", reply);

  res.set("Content-Type", "text/xml");
  res.send(reply);
};
