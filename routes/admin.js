
const { Router } = require("express")
const adminRouter = Router()
const { adminModel, courseModel } = require("../db")

const jwt = require("jsonwebtoken") // import jwt 

const { JWT_ADMIN_SECRET }= require("../config")
// console.log(JWT_ADMIN_SECRET, "admin routes");

const bcrypt = require("bcrypt")
const { z } = require("zod")
const { adminMiddleware } = require("../middleware/admin")

///adminRouter.use(express.json()) // not needed here - only sufficient in index.js file 

// NOTE: Since express.json() is already in index.js, all routers (adminRouter, userRouter, courseRouter) will automatically receive parsed JSON data.

// admin signup
adminRouter.post("/signup", async (req,res)=> {
    // adminSchema has email, password, fristName and lastName
    // use hashing for password

    // validate the input using zod 
    const requireBody = z.object({
        email: z.string().min(7).max(20).email(),
        password: z.string().min(3).max(20),
        firstName: z.string().min(3).max(20),
        lastName: z.string().min(3).max(20)
    })

    // input validation using zod step2 : safeParse
    const parsedDataWithSuccess = requireBody.safeParse(req.body)

    // if parsedDataWithSuccess was a success, proceed with the usual proceedings, else, respoind back the user the problem 

    if (!parsedDataWithSuccess.success){
        // safeParse gave error, so we respond back to the user about the problem 
        // safeParse gives us .success and .error functions 

        res.json({
            message: "Incorrect i/p data",
            error: parsedDataWithSuccess.error
        })
        return 

    }
    // else parsedData using safeParse was a success, business as usual

    
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // or using destructoring of req.body
    // const { email, password, firstName, lastName } = req.body 

        
    // NOTE:  Check if email already exists - if two requests with the same email come at the same time, both could pass validation before MongoDB enforces uniqueness.
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }



    // hash the password before storing them into the database 
    const hashedPassword = await bcrypt.hash(password, 5)
    console.log(hashedPassword);
    

    //store them in database 
    // we have already defined adminModel whose sole work is to put data into admins collection inside database following the admin schema 

    await adminModel.create({
        email: email,
        //password: password, // dont save plain password into the database
        password: hashedPassword, // save salted hashed password into the database 
        firstName: firstName,
        lastName: lastName
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
  "password": "$2@5bsshfksdhfoewrtu43934rt4w2n823.13423rhdswweei",
  "firstName": "agoda",
  "lastName": "hathoda",
  "__v": 0
}

- see how mongodb has itself set an id (object id) to this admin user ---> we can access it using admin._id in the /signin endpoint
- we use that _id as a payload inside /signin endpoint to generate jwt token

*/


// admin signin 
adminRouter.post('/signin', async (req,res)=>{

    // 1. we ask user to sign in using email and password
    // 2. we check if any admin with this email and password exists or not 
    // 3. if exists, we create a token using jsonwebtoken and return to the user 

    const email = req.body.email
    const password = req.body.password

    // we first check database for email existence or not
    // we won't send plain password to be matched in database, as we had saved hashed password into the database 

    const admin = await adminModel.findOne({
        email: email,
        //// password: password
    })  

    // if a user admin exists with this email, its all info gets saved into admin variable

    console.log(admin, "from signin");

    // if database has none admin with this email id, we respond back- wrong creadentials
    if (!admin){
        res.status(403).json({
            message: "incorrect creds"
        })
        return 
    }

    // if yes, an admin with that email exists, as a next step, we match the password
    
    //  we match the hashed password 
    // we will use bcrypt.compare(plain password, saved hashed password) - it does all the back door work- and tell us the final result 

    // comparing the password of the user admin
    const passwordMatched = await bcrypt.compare(password, admin.password)


    if (passwordMatched){
        // generate token using jsonwebtoken - jwt 
        // install jsonwebtoken 
        // import jwt from jsonwebtoken
        // generate a jwt secret for the jwt token
        // use jwt.sign(payload, JWT_SECRET) to generate a jwt token using the payload 
        console.log( "/signin", admin._id);
        
        
        const token = jwt.sign({
            adminId : admin._id // admin will be assigned an unique Object id at the time of storing them into mongodb database 
        }, JWT_ADMIN_SECRET)

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


})



// ~~~~~~~~~~~~~~ authenticated endpoints ~~~~~~~~~~~~~~
// for all below endpoints, we'll add a middleware- adminMiddleware 
// which always checks if the user is admin or not - and only if user is admin, it allows them to hit these endpoints and do changes.
// this middleware also modifies the req body and insert the admin unique Id (extracted from the token)
// this admin unique id is the same that we had used as adminId in the generation of token (as payload).

// these endpoints can use this adminId now by accessing them directly from req...


// to add this middleware into all the below endpoints 
// adminRouter.use(adminMiddleware) // Not needed if i am manually adding this middleware in each authenticated routes.
// If we keep adminRouter.use(adminMiddleware), it automatically applies adminMiddleware to all routes that come after this line.



// admin add a new course 
adminRouter.post("/course",adminMiddleware, async (req,res)=>{
    // 1. auth is checked on user by adminMiddleware first - to check if the admin is signed in or not 
    // 2. adminMiddleware - checks if admin is signed in or not , if yes, he'll modify the req body and put adminId inside req.
    // 3. if admin is signed in, we asks courseModel to create a new course for this creator. we give this courseModel all the info based on courseSchema defined in db.js.


    const adminId = req.adminId // adminMiddleware had it stored in req, so we access it directly from req

    // this endpoint expects the user to give title, desc, imageURL, and price about the course that they want to create.
    const { title, description, imageUrl, price } = req.body // creator of this course sends these info

    /*

    // course schema defined in db.js

        // course schema 
    const courseSchema = new Schema({
        title: String,
        description: String,
        price: Number,
        imageURL: String, 
        creatorId: ObjectId

        })

    */

    // next thing, we ask courseModel to create this course with the given data into the database collection (courses) for us.
    
    // we give courseModel every info it needs based on courseSchem and asks it to create this course for us.
    const newCourse = await courseModel.create({

        // we store following info about this new course 
        title, 
        description, 
        imageUrl, 
        price,
        creatorId: adminId, // which creator created this course


    })

    // respond to the user about this new course added, also send back the courseId set by the mongoDb.
    res.json({
        message: "new course added", 
        courseId: newCourse._id
    })
})




// admin do the changes in existing courses // update the course 
adminRouter.put("/course", adminMiddleware, async function(req,res){

    // NOTE: creator should be able to make changes to their own course. 
    // suppose there are two creators, then they shouldn't be able to make changes to each other's courses. 
    // if one creator gets the courseId of the course of other creator, they shouldn't be able to update the channges in that course. 
    // to ensure that, we always first ensure if the course belongs to this admin or not- by making sure if this courseId sent by user belongs to him or not ??!!


    // they will send us every info - updated title, etc

    const adminId = req.adminId // adminMiddleware had it stored in req, so we access it directly from req
    const { title, description, imageUrl, price, courseId } = req.body // creator of this course sends these info

    
    //doing this, we can early return if someone else tries to make changes to someone else's course.
    const courseFind = await courseModel.findOne({
        /// courseId: courseId,  // ❌ WRONG
        _id: courseId, //✅ CORRECT 
        // IMPORTANT :There is no courseId field in the MongoDB document.
        // MongoDB automatically stores IDs in the _id field.
        // Your database only knows _id, not courseId.
        creatorId: adminId
    })

    if (!courseFind){
        res.status(403).json({
            message: "you're not authorised to make changes to this course."
        })

    }

    
    // only when it exists, we go an updating the course. 
    // the early check and return is good thing only 


    // updateOne (filter, update, options? ) - check definition for help 
    // filter - kaun sa course mein aap changes karrn chahte ho
    // update- updated info - what all things we want to update 
    const courseToBeChanged = await courseModel.updateOne({

        _id : courseId, // make changes to the course with this courseId
        creatorId : adminId // and this adminID

        // update the changes in that course only where these both info matches.
        // some other creator should not be able to make changes to other courses.
        // to ensure that, we must always check the courseID and adminID both belongs to same admin or not.
        // doing that above thingy, it is not possible to find a course with courseID of one of the courses of other cretaor and adminID of other creator. // so it does the work. 
        // or we could use .findOne with these info 
    },
    { 
        // below are the things we want to update 
        title: title,
        description: description,
        imageUrl: imageUrl, 
        price: price, // price gets updated
        // NOTE: adminId cant get updated, therefore not updated the creatorId


    })

    // respond to the user about this new course added, also send back the courseId set by the mongoDb.
    res.json({
        message: "course updated.", 
        // courseId: courseToBeChanged._id // updateOne() doesnt return it 
    })

})


// admin get all of its courses 
adminRouter.get("/course/bulk",adminMiddleware, async (req,res)=>{
    
    const adminId = req.adminId
    // we use .find On couseModel to get all the courses of this user.
    // .find returns list of all courses 
    const allCourses = await courseModel.find({
        creatorId : adminId // find all courses of this creator- adminID

    })

    // respond to the admin user all of its courses
    res.json({
        message: "All of your courses.", 
        allCourses: allCourses
    })
    

}) 


// // admin delete a course : try it later 
// adminRouter.delete("/course", (req,res)=>{
//     res.json({
//         message: "admin can delete an existing course"
//     })
// })

module.exports = {
    adminRouter: adminRouter
}