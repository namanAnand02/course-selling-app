const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET // generate a jwt secret for admin
const JWT_USER_SECRET = process.env.JWT_USER_SECRET // generate a jwt secret for user.

module.exports = {
    JWT_ADMIN_SECRET: JWT_ADMIN_SECRET,
    JWT_USER_SECRET: JWT_USER_SECRET
}