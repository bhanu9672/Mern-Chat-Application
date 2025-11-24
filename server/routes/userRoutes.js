import express from "express"
import { Signup, Login, updateProfile, checkAuth } from "../controllers/userController"
import { protectRoute } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post( "/sinup", Signup )
userRouter.post( "/login", Login )
userRouter.post( "/update-profile", protectRoute, updateProfile )
userRouter.post( "/check", protectRoute, checkAuth )

export default userRouter