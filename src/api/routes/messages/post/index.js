export const postMessages = (req, res) => {
    const {id} = req.params;
    const {templateId, languageId} = req.body;
    console.log({id, templateId, languageId})
    
    // Send sms message

    res.send({success: true})
}