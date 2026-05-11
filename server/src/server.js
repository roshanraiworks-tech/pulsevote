import http from "http";

import { Server } from "socket.io";

import dotenv from "dotenv";

import app from "./app.js";

import { setupSocket } from "./sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",

        methods: ["GET", "POST"],
    },
});

setupSocket(io);

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});