import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/database.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io"

// create Expresss App & HTTP Server
const app = express()
const server = http.createServer(app)

// Initialize Socket.io Server
export const io = new Server(server, {
    cors: { origin: "*" }
})

// Store Online Users
export const userSocketMap = {} // { userId: socketId }

// Socket.on Connection Handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId)

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit Online Users to all Connecteed Clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Setup Middleware 
app.use(express.json({ limit: "4mb" }))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Setup 
app.use("/api/status", (req, res) => res.send("Server is Live"))
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

// Connected With MongoDb Database
await connectDB()

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is Running on Port: ${PORT}`)
    })
}

// Export Server For vercel
export default server;