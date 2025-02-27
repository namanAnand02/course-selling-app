// const express = require("express")
// const Router = express.Router // ROuter is a function

// --> the above two lines of code needed if we were to extract Router that way
// or const { Router } = require("express")

const { Router } = require("express") // this way, we can directly extract Router from express

const userRouter = Router()  // created a userRoute instance out of Router 
// note : Router is a function 
const { userModel } = require('../db') // import userModel from db.js



userRouter.post("/signup", function (req,res){
    res.json({
        message: "signed up endpoint"
    })
})


userRouter.post("/signin", function (req,res){
    res.json({
        message: "sign in endpoint"
    })
})


// endpoint for user to get all their purchased courses
userRouter.get("/purchases", function (req,res){
    res.json({
        message: "purchases endpoint"
    })

})



module.exports = {
    userRouter: userRouter
}




/* 
~~~~~~~~~ 1. while using the first approach - importing express then using dot method to extract Router from express ~~~~~~~~

// Yes, you still need to import express inside user.js to access Router.

// Why?
// Each file in Node.js runs in its own module scope.
// Just because you imported express in index.js does not mean it's available in user.js.
// You must explicitly import express in every file where you need it.
// Each file manages its own dependencies, so always import express inside each file where you use it.  




~~~~~~~~~~ 2. when we use destructures to extract Router from express ~~~~~~~~~~

const { Router } = require("express") - destructing method 

- in here, we dont need to explicitly import express 
- the above line of code under the hood does that anyway 

-- This line does the following:

- - -> Imports the express module.
- - -> Destructures the Router property from the express object.
- - -> Assigns the extracted Router function to a constant named Router.


**** so directly do this instead ****
--------
const { Router } = require("express"); // Extract Router from Express

const userRoute = Router(); // Create a Router instance

userRoute.get("/profile", (req, res) => {
    res.json({ message: "User profile data" });
});

module.exports = { userRoute }; // Export the Router instance
----------

NOTE : 

// benefit of using app.use(..) and express -Routing? 
// - redundancy handled - we dont need to re mention /user again at endpoints inside user.js 

*/
