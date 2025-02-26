const express = require("express")
const app = express()

// route skeleton for user login, signup, purchase a course, see course


app.post("/signup", function (req,res){
    // the user sends us the data to signup 
    // we store the user info at our database 

    const email = req.body.email
    const name = req.body.name
})

app.post("/signin", function (req,res){
    // the user sends us the data to signin 

    const email = req.body.email
    const name = req.body.name
})


app.post("/course/purchase", function (req,res){

})

app.get("/course/see", fucntion(req,res){
    
})