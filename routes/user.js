// const express = require("express")
// const Router = express.Router // ROuter is a function

// --> the above two lines of code needed if we were to extract Router that way
// or const { Router } = require("express")

const { Router } = require("express") // this way, we can directly extract Router from express

const userRouter = Router()  // created a userRoute instance out of Router 
// note : Router is a function 
const { userModel, purchaseModel } = require('../db') // import userModel from db.js

const { z } = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
/// const JWT_SECRET = "us3r" // removed from here and put it in config.js file.
// to use JWT_USER_SECRET here, we now import it from config.js 
const { JWT_USER_SECRET } = require("../config")


const { userMiddleware } = require("../middleware/user")
 
// ~~~~~~~~~ user endpoints ~~~~~~~~~~~~~~~

userRouter.post("/signup", async function (req,res){
    // 0. i/p validation using zod 
    // 1. access the email, password, firstName, and lastName from the user.
    // 2. hash the password before saving it into db - we shudn't save the plain text password into the db
    // 3. save these user's data into database collection - users collection


    const requireBody = z.object({
        email: z.string().min(3).max(50).email(),
        password: z.string().min(3).max(20),
        firstName: z.string().min(5).max(20),
        lastName: z.string().min(3).max(20)
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
        }, JWT_USER_SECRET)

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



// defined userMiddleware in separate milddeware folder 


// ~~~~~ authenticated endpoints ~~~~~~~~~



// to purchase a new course by the user, we have defined a separate endpoint in course.js file 


// endpoint for user to get all their purchased courses
userRouter.get("/purchases", userMiddleware, async function (req,res){
    // this is where we will learn about relationship in MongoDb.
    
    // try{
    //     const userId = req.userId // access the userId from req (userMiddleware had it added into it.)

    
    //     const purchases = await purchaseModel.find({
    //         userId
    //     })
    
    //     if (!purchases.length){
    //         return res.status(404).json({
    //             message:"No purchases yet for this user."
    //         })
    //     }
             
    //     res.status(200).json({
    //         message: "user gets to view his purchases.",
    //         purchases: purchases
    //     })
    // } catch(err){
    //     res.status(500).json({
    //         message: "error retriving purchases.",
    //         error: err.message
    //     })
    // }

    // the above code only returns the courseId and not the details about the courses. 
    // to do that, we need to use references concept of mongo 

    // We need to use MongoDB's populate() method to fetch full details of each purchased course.
    // before that, we make sure that our purchaseModel defines courseId as a reference to courseModel.

    console.log(req.userId, "purchase ENdpoint");
    
    const userId = req.userId

    // find the purchases and populate the course details 
    const purchases = await purchaseModel.find({userId}).populate("courseId")
    // Used .populate("courseId") → This fetches all details of the purchased courses.

    if (!purchases.length){
        return res.status(404).json({
            message: "No purchases yet for this user."
        })
    }

    res.status(200).json({
        message: "user gets to view their purchases.",
        purchases: purchases
    })

    // NOTE: i need to make sure that my purchaseModel in the db.js defines courseId as a reference to courseModel.

    /*
    - purchase schame and purchase model should be like this:-

    const purchaseSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Make sure "Course" matches your courseModel name
        purchaseDate: { type: Date, default: Date.now }
    });

    const purchaseModel = mongoose.model("Purchase", purchaseSchema);
    
    */

    /*
    
    NOTE: if we want to populate both userId and courseId (to see both user and course details), we can use in user/purchase endpoint in user.js:

    const purchases = await purchaseModel.find({ userId })
    .populate("courseId")
    .populate("userId");

    */

    

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
