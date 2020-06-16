import { getMessagesFromDb } from "../messages";
import { getRepliesFromDb } from "../replies";

export default (req, res) => {
  const { appointmentId } = req.params;
  
  return Promise.all([
    getMessagesFromDb(appointmentId),
    getRepliesFromDb(appointmentId)
  ])
    .then(([messages, replies]) =>
      res.status(200).send({
        messages,
        replies
      })
    );
}
