## Create a course selling app 

- Initialise a new Node.js project 
- add express, jsonwebtoken, mongoose to it as a dependency
- add route skeleton for user login, signup, purchase a course, see their purchased course, sees all courses 
- add routes for admin login, admin signup, create a course, delete a course, add course content.
- define schema for User, Admin, Course, Purchase 
- add a database (mongoDb), Use dotenv to store the database collection string
    - NOTE:  we did one improvements in step 5: we wrapped database connection and listening on port inside one func, we await database connection first, and on success, we listen on port 3000.
    - Another improvement is about using dotenv, something i'll learn and do later.

- add middlewares for user and admin auth 




