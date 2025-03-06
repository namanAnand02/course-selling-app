const { Router } = require("express")
const courseRouter = Router()

const { courseModel, userModel, purchaseModel } = require('../db')
const { userMiddleware } = require("../middleware/user")



// endpoint for user to hit when he wants a new course 
courseRouter.post("/purchase", userMiddleware, async function(req,res){
    // this endpoint is to buy new courses by the user

    // we are not adding payment thingy to buy new course in this project yet.
    // user hits this endpoint and that way he purchases it 


    // 1.  user auth gets checked by userMiddleware first
    // purchase schema is defined (in db.js) and purchaseModel is someone which will store the user's purchases in the purchases database follwoing purchase schema 

    // purchase schema demands userId and courseId
    // 2. so user sends these two things through body 
    const userId = req.userId
    const courseId = req.body.courseId

    // TODO: put a check if this course is already bought by the user or not 


    // 3. we call purchaseModel and feed these info for it ot create a purchase for this user and store it in purchases collection in database 
    await purchaseModel.create({
        userId, 
        courseId
    })


    res.json({
        message: "you've successfully bought this course."
    })
})


// endpoint for user to see all the courses 
courseRouter.get("/preview", async function (req,res){
    // this is the endpoint where anyone can see all the courses available on the application 
    // even if they are not signed in.
    // that's why no middleware added to it. 


    try{
        const allCourses = await courseModel.find()
    
        res.json({
            message: "List of all courses.", 
            allCourses: allCourses
        })
    } catch(error){
        res.status(500).json({
            message:"error retrieving courses",
            error: error.message
        })
    }

    // or 

    // const allCourses = await courseModel.find({})

    // res.json({
    //     message: "you can see all courses of this application now." , 
    //     allCourses
    // })
})



// then we export this function 
module.exports = {
    courseRouter: courseRouter
}



/*

1. import express 
2. access Router from express or require Router from express

3. create a Router instance - - -> const courseRouter = Router()
4. replace app with courseRouter in all the route endpoints starting with /course 

5. export courseRouter at the end 


~~~~~~~ index.js ~~~~~~~~~~~~

1. import this courseRouter from course.js using require
- -> const { courseRouter } = require("./routes/course")

2. implement --> app.use("/course", courseRouter) 
- meaning all the route endpoints starting with /course is handled by courseRouter 

*/


