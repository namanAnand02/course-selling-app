// const express = require("express")
// const Router = express.Router()

// or const { Router } = require("express")
const { Router } = require("express")
const courseRouter = Router()


// endpoint for user to hit when he wants a new course 
courseRouter.post("/purchase", function(req,res){
    // this endpoint is to buy new courses by the user

    // we are not adding payment thingy to buy new course in this project yet.
    // user hits this endpoint and that way he purchases it 

    res.json({
        message: "you've hit /api/v1/course/purchase endpoint. "
    })
})


// endpoint for user to see all the courses 
courseRouter.get("/preview", function (req,res){

    res.json({
        message: "you've hit /api/v1/course/preview endpoint. "
    })
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


