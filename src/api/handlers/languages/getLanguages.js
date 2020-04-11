import LanguagesModel from "../../../models/languages";

export default (req, res) => {
  return res.status(200).send(LanguagesModel.getAll());
};
