const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
    {
        username: {
            type:String,
            required:true,
            unique:true,
        },
        password: {
            type:String,
            required:true
        },
        firstName: {
            type:String,
            required:true,
        },
        lastName: {
            type:String,
            required:true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            required: true,
          },
    }, {timestamps:true}
)
userSchema.pre("save",async function (next) {
    const user = this
    if (user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 10) // converting the password to the hash 
    }
    next()
})
userSchema.methods.toJSON = function () {
    const user = this
    const userToObject = user.toObject()
    delete userToObject.password
    return userToObject
}
userSchema.statics.findByCredentials = async function (username, password) {
    const user = await this.findOne({ username })
    if (user) {
      const matches = await bcrypt.compare(password, user.password)
      if (matches) return user
      else return null
    } else return null
  }

module.exports = model("users",userSchema)