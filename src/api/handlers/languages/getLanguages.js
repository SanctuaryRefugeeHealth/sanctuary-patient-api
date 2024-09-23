import { getAllLanguages } from "../../../models/languages.js";

export default async (req, res) => {
  return res.status(200).send(await getAllLanguages());
};
