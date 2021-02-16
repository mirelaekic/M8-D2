const userSchema = require("./users/scheme")
const atob =require("atob");

const basicAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
      const error = new Error("you need authentication")
      error.httpStatusCode = 401
      next(error)
    } else {
      const [username, password] = atob(
        req.headers.authorization.split(" ")[1]
      ).split(":")
  
      const user = await userSchema.findByCredentials(username, password)
      if (!user) {
        const error = new Error("wrong credentials provided")
        error.httpStatusCode = 401
        next(error)
      } else {
          req.user = user
        } 
        
        next()
    }
}

const adminOnlyMiddleware = async (req, res, next) => {
    console.log(req.user,"user")
    if (req.user && req.user.role === "admin") {
      next()
    } else {
      const err = new Error("Only admin can see this")
      err.httpStatusCode = 403
      next(err)
    }
  }

module.exports = {
    adminOnly:adminOnlyMiddleware,
    auth:basicAuth,
}