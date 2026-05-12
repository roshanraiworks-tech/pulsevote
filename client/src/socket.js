import { io } from "socket.io-client";

// const serverUrl = io(
//     import.meta.env.VITE_SERVER_URL ||
//     "https://pulsevote-rr0y.onrender.com",
//     {
//         autoConnect: false,

//         reconnection: true,

//         reconnectionAttempts: 10,

//         reconnectionDelay: 1000,
//     }
// );

const serverUrl =
    import.meta.env.VITE_SERVER_URL || "https://pulsevote-rr0y.onrender.com";

const socket = io(serverUrl, {
    autoConnect: false,
});


export default socket;