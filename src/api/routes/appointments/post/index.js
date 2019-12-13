
export default (req, res) => {
    console.log(req.body)
    res.status(201).send({success: true});
}