const { Router } = require("express")
const adminRouter = Router()

// admin signup
adminRouter.post("/signup", (req,res)=> {
    res.json({
        message: "you're the admin and you're signed up."
    })
})


// admin login 
adminRouter.post('/signin', (req,res)=>{
    res.json({
        message: "you're the admin and you're signed in."
    })
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