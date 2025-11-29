import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backEndUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backEndUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set Authorization header globally
  const setAuthHeader = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  // Initialize auth from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setAuthHeader(savedToken);
      }
      setIsLoading(false);
    };
    initAuth();
  }, [setAuthHeader]);

  // Check auth on token change
  const checkAuth = async () => {
    if (!token) return;
    try {
      const { data } = await axios.post("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Check auth failed:", error);
      if (error.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    if (token) checkAuth();
  }, [token]);

  // Login
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        const user = data.user || data.userData;
        setAuthUser(user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAuthHeader(data.token);

        connectSocket(user);
        toast.success(data.message || "Logged in successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg || "Login failed");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    setAuthHeader(null);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    toast.success("Logged out successfully");
  };

  // Update Profile (pass current token)
  const updateProfile = async (body, currentToken) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body, {
        headers: {
          Authorization: `Bearer ${currentToken || token}`,
        },
      });

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
    }
  };

  // Socket connection
  const connectSocket = (user) => {
    if (!user) return;

    const newSocket = io(backEndUrl, {
      auth: { token },
      query: { userId: user._id },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));

    newSocket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    newSocket.on("disconnect", () => setSocket(null));
  };

  const value = {
    authUser,
    setAuthUser,
    token,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    isLoading,
    axios, 
  };

  return <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>;
};