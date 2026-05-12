import { io } from "socket.io-client";

const socket = io(
    import.meta.env.VITE_SERVER_URL ||
    "https://pulsevote-rr0y.onrender.com",
    {
        autoConnect: false,

        reconnection: true,

        reconnectionAttempts: 10,

        reconnectionDelay: 1000,
    }
);

export default socket;