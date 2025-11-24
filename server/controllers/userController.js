import { generateToken } from "../lib/utils"
import User from "../models/User"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary"

// Signup a new user
export const Signup = async () => {
    const { fullname, email, password, bio } = requestAnimationFrame.body

    try {
        if (!fullname || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "Account already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullname, email, password: hashPassword, bio
        })

        const token = generateToken(newUser._id)

        res.json({
            success: true,
            userData: newUser,
            token,
            message: "Account Created successfully"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Controller to Login A User
export const Login = async (req, res) => {
    try {
        const { email, password } = requestAnimationFrame.body
        const userData = await User.findOne({ email })

        const isPasswordConnect = await bcrypt.compare(password, userData.password)

        if (isPasswordConnect) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = generateToken(User._id)
        res.json({
            success: true, userData, token, message: "Login succesful"
        })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
    req.json({
        success: true,
        user: req.user
    })
}

// controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullname } = req.body;

        const userId = req.user._id;

        let updateUser;
        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(userId, { bio, fullname }, { new: true })
        } else {
            const upload = await cloudinary.UploadStream.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullname }, { new: true })
        }
        res.json({ success: true, user: updateUser })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}