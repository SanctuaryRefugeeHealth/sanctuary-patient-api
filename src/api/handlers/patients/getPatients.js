import { getPatients } from "../../../models/patient";

export default async(req, res) => {

    const filter = req.query.filter;

    if (filter === null ||
        typeof filter !== 'string' ||
        filter.length < 3) {
            return res.status(400).send({
                message: "Invalid filter criteria."
            });
        }

    return res.status(200).send(await getPatients(filter));
}