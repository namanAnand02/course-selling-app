const express = require("express")
const app = express()

const { userRouter } = require("./routes/user")
const { courseRouter } = require("./routes/course")


// app.use for userRouter
app.use("/user", userRouter) 
// any endpoints starting with /user gets handled by userRouter
// userRouter defined in a separate file = user.js 

app.use("/course", courseRouter)



// ideal thing is to create a route folder and put all these course and user.js files inside them 


app.listen(3000)

