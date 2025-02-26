const express = require("express")
const app = express()

// route skeleton for user login, signup, purchase a course, see course


app.post("/user/signup", function (req,res){
    res.json({
        message: "signed up endpoint"
    })
})


app.post("/user/signin", function (req,res){
    res.json({
        message: "sign in endpoint"
    })
})


// endpoint for user to hit when he wants a new course 
app.post("/course/purchase", function(req,res){
    // this endpoint is to buy new courses by the user

    // we are not adding payment thingy to buy new course in this project yet.
    // user hits this endpoint and that way he purchases it 
})


// endpoint for user to get all their purchased courses
app.get("/user/purchases", function (req,res){

})


// endpoint for user to see all the courses 
app.get("/courses", function (req,res){

})

app.listen(3000)

