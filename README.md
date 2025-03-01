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


- add middlewares for user and admin auth 




