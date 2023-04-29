const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try{
        const {from,to,message} = req.body;
        const data = await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from
        })
        if(data){
            return res.json({
                msg:"Message Added Successfully"
            })
        }
        return res.json({
            msg:"Failed to add msg to the database"
        })
    }catch(E){
        next(E)
    }
}


module.exports.getAllMessage = async (req, res, next) => {
    try{
        const {from,to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all:[from,to]
            }
        }).sort({updateAt:1})
        const projectedMessages = messages.map((msg) =>{
            return {
                fromSelf:msg.sender.toString() ===from,
                message:msg.message.text
            }
        })
        res.json(projectedMessages)
    }catch(e){
        next(e)
    }
}