const express = require("express")
const app = express()
const { userRouter } = require("./routes/user")
const { courseRouter } = require("./routes/course")
const { adminRouter } = require("./routes/admin")

const mongoose = require("mongoose") // this is also req here as we are doing mongoose.connect(..) here.

// app.use(express.json())

// app.use for userRouter
app.use("/api/v1/user", userRouter) 
// any endpoints starting with /user gets handled by userRouter which is defined in user.js
// userRouter defined in a separate file = user.js 

app.use("/api/v1/course", courseRouter)

// admin router handler 
app.use("/api/v1/admin", adminRouter)



// ideal thing is to create a route folder and put all these course and user.js files inside them 

 


/*

~~~~~~~~~~~~~~~~~ improvements on connecting to database i.e step 5  ~~~~~~~~~~~~~~~~~~~~~~

1. await the database connection here before starting the application on port 3000

2. bad idea to store string data inside mongoose.connect(..) --> use something called dotenv to put our environment variable in a separate file 

*/



// listening on port 3000 after database connection
async function main(){
    try{

        await mongoose.connect("mongodb+srv://username:password@cluster0.6k4iz.mongodb.net/coursera-app-database")
        // only when database gets connected, is when we start our application on port 3000
        console.log("database connected");
        
        app.listen(3000)

    } catch(error){
        console.log("database connection failed: ", error); // this also logs the error along with the log msg of database connection failed.
    }

    // we need to put try...catch inside the main() function to handle errors during execution.
}

// calling this main function - for mongoDb to connect first and server to start.
main()