import LanguagesModel from "../../../models/languages";

export default (req, res) => {
    res.status(200).send(LanguagesModel.getAll());
};
