import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Middleware to protect Routes
export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // "Bearer <token>"
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        req.user = user; // attach user to request
        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
export const checkAuth = (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};