
const jwt = require("jsonwebtoken")
const { JWT_ADMIN_SECRET } = require("../config");



function adminMiddleware (req,res,next){

    // 1. access the token sent by the user through headers
    // 2. verify and store existing user with that token 
    const token = req.headers.token
    const decodedInfo = jwt.verify(token, JWT_ADMIN_SECRET) 
    console.log(decodedInfo, "hello from adminMiddleware"); // { adminId: '67c5479c33cca022381b4b94', iat: 1740982212 }
    

    if (decodedInfo){
        // if admin has signed in, this middleware modifies the req body 
        // at the time of generation of Token, we had encoded a"dmin unique objectId "as "adminId" inside the token in the form of payload.

        // this middleware extracts that adminId from the token and put that inside req body for other endpoints to use it.
        req.adminId = decodedInfo.adminId,
        next()
         
    } else{
        res.status(403).json({
            message: "You are not signed in."
        })
    }
}


// at last, export this middleware from here so that it can be used in /routes/user.js authenticated endpoints 
module.exports = {
    adminMiddleware: adminMiddleware
}