const express = require("express")
const { userRouter } = require("./routes/user")
const { courseRouter } = require("./routes/course")
const app = express()

// app.use(express.json())

// app.use for userRouter
app.use("/api/v1/user", userRouter) 
// any endpoints starting with /user gets handled by userRouter
// userRouter defined in a separate file = user.js 

app.use("/api/v1/course", courseRouter)



// ideal thing is to create a route folder and put all these course and user.js files inside them 


app.listen(3000)

