const express = require("express")
const Router = express.Router // ROuter is a function

// or const { Router } = require("express")

const userRoute = Router()  // created a userRoute instance out of Router 
// note : Router is a function 


userRoute.post("/signup", function (req,res){
    res.json({
        message: "signed up endpoint"
    })
})


userRoute.post("/signin", function (req,res){
    res.json({
        message: "sign in endpoint"
    })
})


// endpoint for user to get all their purchased courses
userRoute.get("/purchases", function (req,res){
    res.json({
        message: "purchases endpoint"
    })

})



module.exports = {
    userRoute: userRoute
}



// Yes, you still need to import express inside user.js to access Router.

// Why?
// Each file in Node.js runs in its own module scope.
// Just because you imported express in index.js does not mean it's available in user.js.
// You must explicitly import express in every file where you need it.
// Each file manages its own dependencies, so always import express inside each file where you use it.  