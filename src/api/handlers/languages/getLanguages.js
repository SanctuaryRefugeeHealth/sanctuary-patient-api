import { getAllLanguages } from "../../../models/languages";

export default async (req, res) => {
  return res.status(200).send(await getAllLanguages());
};
