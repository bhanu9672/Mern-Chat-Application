import express from "express"
import { Signup, Login, updateProfile, checkAuth } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post( "/signup", Signup )
userRouter.post( "/login", Login )
userRouter.put( "/update-profile", protectRoute, updateProfile )
userRouter.post( "/check", protectRoute, checkAuth )

export default userRouter;