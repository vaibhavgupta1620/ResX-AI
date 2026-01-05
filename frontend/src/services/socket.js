import { io } from "socket.io-client";

// Use backend URL from environment variable
const SOCKET_URL = import.meta.env.VITE_API_URL;

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
});
