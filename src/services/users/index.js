const express = require("express")
const userSchema = require("./scheme");
const router = express.Router()
const {adminOnly,auth} = require("../authorizationTools")

router.get("/",auth,adminOnly ,async(req,res,next) => {
    try {
        const users=await userSchema.find();
        res.send(users)
    } catch (error) {
        next(error)
    }
});

router.post("/register",async(req,res,next) => {
    try {
        const newUser = new userSchema(req.body)
        const {_id} = await newUser.save()
        res.status(201).send(_id) 
    } catch (error) {
        next(error)
    }
});

router.get("/me",auth,async(req,res,next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
});

router.put("/me",auth,async(req,res,next) => {
    try {
        const update = Object.keys(req.body)
        console.log(update)
        update.forEach(update => (req.user[update] = req.body[update]))
        await req.user.save()
        res.send(req.user)
        res.send(update)
    } catch (error) {
        next(error)
    }
});

router.delete("/me",auth,async(req,res,next) => {
    try {
        await req.user.deleteOne()
        req.status(204).send("Deleted")
    } catch (error) {
        next(error)
    }
});

module.exports = router