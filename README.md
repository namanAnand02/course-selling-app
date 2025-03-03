## Create a course selling app 

- Initialise a new Node.js project 
- add express, jsonwebtoken, mongoose to it as a dependency
- add route skeleton for user login, signup, purchase a course, see their purchased course, sees all courses 
- add routes for admin login, admin signup, create a course, delete a course, add course content.
- define schema for User, Admin, Course, Purchase 
- add a database (mongoDb), Use dotenv to store the database collection string
    - NOTE:  we did one improvements in step 5: we wrapped database connection and listening on port inside one func, we await database connection first, and on success, we listen on port 3000.
    - Another improvement is about using dotenv, something i'll learn and do later.

- step 6: write the business logic for admin 

    - used hashing of password using bcrypt lib, zod for i/p validation, adminModel.create({..}) to save data into db
    - /signup endpoint 
        - user send email, password, first and last name. We access it from req.
        - add a check for email already existing, IMP!
        - we hash the password --> use await bcrypt.hash(plainpassword, saltRounds). And we store this hashed password into the database and not that plain password.
        - store the info into database --> await adminModel.create({pass diff schema based input data})
        - at last, we respond back to admin user that he signed up. 

    - /signin endpoint 
        - user again sends email and password and we access them using req. 
        - we first check if any admin with this email exists or not?! we dont check for password into the database as this is plain text password and we have saved hashed one into db during signup.
        - if admin exists with that email, we then compare password --> use bcrypt.compare(plainPass, HashedPass), we access saved hashedPass from admin using admin.password.
        - only when password matches, we create a JWT token for this admin user using jsonwebtoken --> jwt.sign(payload,JWT_SECRET)
        - and we respond back to the user with this token

        - NOTE: to learn cookie based auth and session based auth.

- business logics for user routes 
    - NOTE: user and admin token generation shud be different. we ensure that by using different JWT_SECRET for both of them.

- step 7: add middlewares for user and admin auth 

    - NOTE: we need to use JWT_SECRET for admin and user in here as well. So either we'll copy paste the variable in this file also, but thats a bad practice. Also another way of doing it is to export from /routes/user.js and import in /middleware/user.js ---> but this leads to cyclic dependencies, which is again bad thing to do.
    Best Practice is to make a separate config.js file which contains JWT_SECRET for both admin and user, and we export them from there. And import them wherever we need them.

    - adminMiddleware 
        - access token sent by user thorugh headers 
        - import secret from config.js 
        - use jwt.verify(token, secret) to verify the token 
        - if token is right, meaning admin is signed in
        - then it modifies the req body and insert the adminId into it. 
        NOTE: (adminID is the unique id set by mongoDb at the time of saving admin info in /signup endpoint, and we had used this adminID as payload to generate the token in /signin endpoint).
        - also export this middleware at last.

        - then in /routes/admin, we import this adminMiddleware to be able to use this. 

    - similarly, we have defined userMiddleware. 

- step 8: define authenticated endpoints of /routes/admin.js
    - /course auth endpoint (to add new course )
        - insert adminMiddleware in between the arguments 
        - this adminMiddleware first checks the auth of admin 
        - if admin is rightly signed in, it inserts the adminId inside req and calls next().
        
        - this endpoint expects admin to give certain info about the new course he wants to create. (info same as defined in courseSchema in db.js)

        - user sends those info like title, desc, etc through body and it access it using destructuring of req.body
        - it also access adminId from req which was inserted by adminMiddleware.

        - then it calls courseModel and feed these info about the course and asks it to create a course for it in the courses collection following courseSchema.

        - at last, it responds back the admin with msg that new course created. Also it sends back the unique courseId set to this course by mongoDB.




