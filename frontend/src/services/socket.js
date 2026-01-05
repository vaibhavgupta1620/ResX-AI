import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

export const socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"], // ✅ allow fallback
    withCredentials: true,
    autoConnect: false, // ✅ VERY IMPORTANT
});
