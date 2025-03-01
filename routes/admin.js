const { Router } = require("express")
const adminRouter = Router()
const { adminModel, userModel } = require("../db")
const { userRouter } = require("./user")
const jwt = require("jsonwebtoken") // import jwt 
const JWT_SECRET = "s3cret" // generate a jwt secret 


///adminRouter.use(express.json()) // not needed here - only sufficient in index.js file 

// NOTE: Since express.json() is already in index.js, all routers (adminRouter, userRouter, courseRouter) will automatically receive parsed JSON data.

// admin signup
adminRouter.post("/signup", async (req,res)=> {
    // adminSchema has email, password, fristName and lastName
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    //store them in database 
    // we have already defined adminModel whose sole work is to put data into admins collection inside database following the admin schema 

    await adminModel.create({
        email,
        password,
        firstName,
        lastName
    })

    // respond back to the user that they have signed up.
    res.json({
        message: "you're the admin and you're signed up."
    })
})

/* 

this is what gets saved inside mongoDB coursera-app-database --> admins collection
   
{
  "_id": {
    "$oid": "67c2bba7d35d4a494185ab08"
  },
  "email": "ramesh@gmail.com",
  "password": "1waseff",
  "firstName": "agoda",
  "lastName": "hathoda",
  "__v": 0
}

- see how mongodb has itself set an id (object id) to this admin user ---> we can access it using admin._id in the /signin endpoint
- we use that _id as a payload inside /signin endpoint to generate jwt token

*/


// admin login 
adminRouter.post('/signin', async (req,res)=>{

    // 1. we ask user to sign in using email and password
    // 2. we check if any admin with this email and password exists or not 
    // 3. if exists, we create a token using jsonwebtoken and return to the user 

    const email = req.body.email
    const password = req.body.password

    const admin = await adminModel.findOne({
        email: email,
        password: password
    })  

    console.log(admin);
    

    if (admin){
        // generate token using jsonwebtoken - jwt 
        // install jsonwebtoken 
        // import jwt from jsonwebtoken
        // generate a jwt secret for the jwt token
        // use jwt.sign(payload, JWT_SECRET) to generate a jwt token using the payload 


        const token = jwt.sign({
            adminId : admin._id // admin will be assigned an unique Object id at the time of storing them into mongodb database 
        }, JWT_SECRET)

        // after generating token, return it to this user admin 
        res.json({
            token: token
        })

    } else{
        // if no such admin ( with the given email, and password ) exists, respond with msg- unauthorised access 
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }





    // res.json({
    //     message: "you're the admin and you're signed in."
    // })
})




// for all below endpoints, we'll add a middleware- adminMiddleware 
// which always checks if the user is admin or not - and only if user is admin, it allows them to hit these endpoints and do changes.

function adminMiddleware(req,res,next){
    // checks if user is admin or not 
    // if user is admin, only then allows the user to hit the below endpoints by calling next()
}

// to add this middleware into all the below endpoints 
adminRouter.use(adminMiddleware) 

// admin add a new course 
adminRouter.post("/course", (req,res)=>{
    res.json({
        message: "new course added"
    })
})

// admin do the changes in existing courses 
adminRouter.put("/course", function(req,res){
    res.json({
        message: "admin can do some changes in the existing courses"
    })
})

// admin delete a course 
adminRouter.delete("/course", (req,res)=>{
    res.json({
        message: "admin can delete an existing course"
    })
})

// admin get to all of its courses 
adminRouter.get("/course/bulk", (req,res)=>{
    res.json({
        message: "admin can see all of its courses here."
    })
}) 



module.exports = {
    adminRouter: adminRouter
}