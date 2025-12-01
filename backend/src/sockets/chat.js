const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room: ${roomId}`);
            socket.to(roomId).emit('user_joined', { socketId: socket.id });
        });

        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
            console.log(`Socket ${socket.id} left room: ${roomId}`);
            socket.to(roomId).emit('user_left', { socketId: socket.id });
        });

        socket.on('chat_message', ({ roomId, message, sender }) => {
            console.log(`Message in room ${roomId} from ${sender}: ${message}`);
            io.to(roomId).emit('chat_message', {
                message,
                sender,
                timestamp: new Date().toISOString()
            });
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

module.exports = setupChatSocket;
