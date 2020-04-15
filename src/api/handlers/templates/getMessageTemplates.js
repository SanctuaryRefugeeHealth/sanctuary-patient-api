import TemplatesModel from "../../../models/templates";

export default (req, res) => {
  return res.status(200).send(TemplatesModel.getAll());
};
