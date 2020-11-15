import { getMessages, getReplies } from "../../../models/communications";

export default async (req, res) => {
  const { appointmentId } = req.params;

  const messages = await getMessages(appointmentId);
  const replies = await getReplies(appointmentId);

  return res.status(200).send({
    messages,
    replies,
  });
};
