// const express = require("express")
// const Router = express.Router // ROuter is a function

// --> the above two lines of code needed if we were to extract Router that way
// or const { Router } = require("express")

const { Router } = require("express") // this way, we can directly extract Router from express

const userRouter = Router()  // created a userRoute instance out of Router 
// note : Router is a function 
const { userModel } = require('../db') // import userModel from db.js

const { z } = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "us3r"



// ~~~~~~~~~ user endpoints ~~~~~~~~~~~~~~~

userRouter.post("/signup", async function (req,res){
    // 0. i/p validation using zod 
    // 1. access the email, password, firstName, and lastName from the user.
    // 2. hash the password before saving it into db - we shudn't save the plain text password into the db
    // 3. save these user's data into database collection - users collection


    const requireBody = z.object({
        email: z.string().min(3).max(50).email(),
        password: z.string().min(7).max(20),
        firstName: z.string().min(7).max(20),
        lastName: z.string().min(7).max(20)
    })

    // i/p validation with zod step 2: parsing using safeParse 
    const parsedDataWithSuccess = requireBody.safeParse(req.body)

    if (!parsedDataWithSuccess.success){
        res.status(403).json({
            message: "input validation unsuccessful.",
            error: parsedDataWithSuccess.error
        })
        return 
    }


    // usual stuffs after parsing is successful.
    const { email, password, firstName, lastName } = req.body;
    
    // NOTE:  Check if email already exists - if two requests with the same email come at the same time, both could pass validation before MongoDB enforces uniqueness.
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }



    // hash the password
    const hashedPassword = await bcrypt.hash(password, 5)

    // save all these data into db using userModel 
    await userModel.create({
        email: email, 
        password: hashedPassword,
        firstName: firstName,
        lastName:lastName
    })

    res.json({
        message: "user has signed up."
    })
})


userRouter.post("/signin", async function (req,res){
    // 1. access email and password from req
    // 2. find the existing user with this email 
    // 3. if user with that email doesn't exist, respond back- incorrect creds 
    // 4. if user with that email exists, compare plainpassword with saved hashed password in db using bcrypt.compare(..)
    // 5. if password matches, generate the jwt tokn for this user using jsonwebtoken 
    
    const { email, password } = req.body

    const user = await userModel.findOne({email:email}) // returns either the user or undefined 
    // NOTE: userModel.find(..) returns us an array of all the user with this email id, so never do that. as in next if(user) will always be true in that case i.e if([]) ==> true but if(undefined) ==> false

    if (!user){
        res.status(403).json({
            message: "incorrect creds" // note: do not mention wrong email to the user, telling them the prob is not safe.
        })
        return 
    }

    // if user with that email exists 
    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (isPasswordMatched){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        // todo: DO COOKIE LOGIC HERE - implement secure cookie storage for the JWT token

        res.status(200).json({
            token: token
        })

    } else {
        res.status(403).json({
            message: "wrong password"
        })
    }


})



// step 6: creating a user middleware 
function userMiddleware(req,res,next){
    // do the auth check on the user and if he passes, only then we let him hit the other authenticated endpoints 
    // ........................
    // ........
}

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
