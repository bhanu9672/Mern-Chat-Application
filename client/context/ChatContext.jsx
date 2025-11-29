import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
 // useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({}); // ← {} not null!

  const authContext = useContext(AuthContext);
  const socket = authContext?.socket;
  //const axios = authContext?.axios;

  if (!authContext) {
    console.error("ChatProvider must be used within AuthProvider");
    return null;
  }

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      //console.log(data)
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {}); // ← safety
      }
    } catch (error) {
      toast.error("Failed to load users");
      console.log(error.message)
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
      console.log(error.message)
    }
  };

  // ← FIXED: POST instead of GET
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // ← Much cleaner socket logic
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser?._id === newMessage.senderId) {
        // We are currently viewing this user → mark as seen
        setMessages((prev) => [...prev, { ...newMessage, seen: true }]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => { });
      } else {
        // Increase unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser, axios]);

  const value = {
    messages,
    setMessages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};