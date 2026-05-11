export function setupSocket(io) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_poll", (pollCode) => {
            socket.join(pollCode);

            console.log(
                `Socket ${socket.id} joined poll room ${pollCode}`
            );
        });

        socket.on("leave_poll", (pollCode) => {
            socket.leave(pollCode);

            console.log(
                `Socket ${socket.id} left poll room ${pollCode}`
            );
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}