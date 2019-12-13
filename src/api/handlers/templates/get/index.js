import TemplatesModel from '../../../../models/templates';

export default (req, res) => {
    res.status(200).send( TemplatesModel.getAll())
};