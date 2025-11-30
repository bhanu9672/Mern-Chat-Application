import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/database.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express App & HTTP Server
const app = express();
const server = http.createServer(app);

// Socket.io Server
export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,    // your frontend Vercel URL
        methods: ["GET", "POST"],
    }
});

// Online Users Map
export const userSocketMap = {};

// Socket Logic
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User Connected: ${userId}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
connectDB();

// PORT (Render sets PORT automatically)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});

export default server;
