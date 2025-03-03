
const jwt = require("jsonwebtoken")
const { JWT_ADMIN_SECRET } = require("../config");


// ~~~~~~~~~~~ improvements ~~~~~~~~~~~~~~

// define a middleware function with password as argument, use it at diff places 
// in user.js middleware, we can make it userMiddleware by just replacing password with JWT_USER_SECRET.
// and in to make it adminMiddleware, we can just replace password with JWT_ADMIN_SECRET.

// but this thing is little complicated to understand - a function inside another function.


// function middleware(password){
//     return function(req,res,next){
//         const token = req.headers.token
//         const decodedInfo = jwt.verify(token, password)
//         if (decodedInfo){
//             req.userId = decodedInfo.adminId
//             next()
//         } else{
//             res.status(403).json({
//                 message:"You are not signed in." 
//             })
//         }
//     }
// }




function adminMiddleware (req,res,next){

    // 1. access the token sent by the user through headers
    // 2. verify and store existing user with that token 
    const token = req.headers.token
    const decodedInfo = jwt.verify(token, JWT_ADMIN_SECRET) 
    console.log(decodedInfo, "hello from adminMiddleware"); // decodedInfo = { adminId: '67c5479c33cca022381b4b94', iat: 1740982212 }
    

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