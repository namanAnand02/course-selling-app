
const jwt = require("jsonwebtoken")
const { JWT_USER_SECRET } = require("../config");



function userMiddleware (req,res,next){

    // 1. access the token sent by the user through headers
    // 2. verify and store existing user with that token 
    const token = req.headers.token
    const decodedInfo = jwt.verify(token, JWT_USER_SECRET) 
    console.log(decodedInfo);
    

    if (decodedInfo){
        req.userID = decodedInfo.userId,
        next()
         
    } else{
        res.status(403).json({
            message: "You are not signed in."
        })
    }
}


// at last, export this middleware from here so that it can be used in /routes/user.js authenticated endpoints 
module.exports = {
    userMiddleware: userMiddleware
}