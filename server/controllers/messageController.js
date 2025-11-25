import Message from "../models/Message";
import User from "../models/User";
import cloudinary from "../lib/cloudinary"

// Get All Users Except The Logged In User
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user_id;
        const filteredUsers = await UserActivation.find({ _id: { $ne: userId } }).select("-password");

        // Count Numbers of Messages not Seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises)
        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages
        })
    } catch (error) {
        console.log(error.Message);
        res.json({
            success: false,
            message: error.Message
        })
    }
}

// Get All Messages For Selected User
export const getMessages = async (req, res) => {
    try {
        const { id: selectctedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: selectctedUserId
                },
                {
                    senderId: selectctedUserId,
                    receiverId: myId
                },
            ]
        })

        await Message.updateMany({
            senderId: selectctedUserId,
            receiverId: myId
        }, { seen: true })

        res.json({
            success: true,
            messages
        })

    } catch (error) {
        console.log(error.Message);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API To Mark Messages as Seen Using Message ID
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Send Message To Selected User 
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id

        let imageUrl;
        if( image ) {
            const cloudinary = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        res.json({ success: true, newMessage })

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}