import TemplatesModel from "../../../models/templates";
import { getMessageResponse } from "../../../services/twilioClient";

export default (req, res) => {

  const language = "English";

  const replyText = TemplatesModel.generateReply(language);

  const reply = getMessageResponse(replyText);


  res.set("Content-Type", "text/xml");
  res.send(reply);
};
