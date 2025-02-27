const mongoose = require("mongoose")
const { Schema } = mongoose // destructure schema - correct!
const ObjectId= mongoose.Types.ObjectId


/*
~~~~~~~~ mongoDb connection ~~~~~~~~~~~~~

// connect this to mongoDb database 
// mongoose.connect("cluseter-URL/my-database-name") // ideally should await this one 


mongoose.connect("mongodb+srv://anandnaman02:v9jPNDcVAXn0QXxN@cluster0.6k4iz.mongodb.net/coursera-app-database")
--> it automatically creates a new database-> "coursera-app-database" for us inside the mentioned cluster URL.

--> and that database will have all the defined collections in dataModel 
--> in dataModels, we have defined 4 collections- > users, admins, courses, purchases 
--> so when coursera-app-database gets created, it will have all these 4 database collections in it.

*/

console.log("database connected") // to check if database connected or not 
mongoose.connect("mongodb+srv://username:paassword.6k4iz.mongodb.net/coursera-app-database")

// after conecting database here, make sure to import the datamodels at the right files like adminModel inside admin.js, etc

// ~~~~~~ define the schema ~~~~~~~~~~

// user schema 
const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String

})
// admin schema 
const adminSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String

})
// course schema 
const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageURL: String, 
    creatorId: ObjectId

})
// purchase schema 
const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId

    // we could use references here that this userID refers to the userSchema
    // courseId refers to this courseSchema 

    // i'll add references thingy later - after i read about that.

})

// one feature of mongoose that I am not using yet - references - i haven't read that concept yet.


// after defining schema, we need to create datamodels from it.
const userModel = mongoose.model("users", userSchema) // insert into users collection following userSchema
const adminModel = mongoose.model("admins", adminSchema) // insert into admins collection following adminSchema
const courseModel = mongoose.model("courses", courseSchema) 
const purchaseModel = mongoose.model("purchases", purchaseSchema) 


// last thing is to export these data models 
module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}




/*
~~~~~~~ Schema ~~~~~~~~~~~~~~

- without destructuring 

const mongoose = require("mongoose")
const Schema = mongoose.schema  // access using dot 

- with destructuring

const mongoose = require("mongoose");  //  Require mongoose first
const { Schema } = mongoose;  //  Destructure Schema

NOTE: 
// const { Schema } = mongoose.Schema // wrong - mongoose.schema is already an object, we should not destructure it - rather directly access it from mongoose

*/



/*
~~~~~~~~~~ data models ~~~~~~~~~~~~~
- models are fancy constructors complied from schema definitions.
- models are responsible for creating and reading documents from the underlying MongoDb database.

- When you call mongoose.model() on a schema, Mongoose compiles a model for you.
- The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name.

--> const userModel = mongoose.model("users", userSchema) // insert into users collection following userSchema

*/