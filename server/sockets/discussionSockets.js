const Message = require("../models/Message");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // When a user joins a discussion
        socket.on("joinDiscussion", (discussionId) => {
            socket.join(discussionId);
            console.log(`User joined discussion ${discussionId}`);
        });

        // When a message is sent
        socket.on("sendMessage", async ({ discussionId, sender, text }) => {
            try {
                const message = new Message({ discussionId, sender, text });
                await message.save(); // Save message to DB
                console.log("Message saved to DB:", message);

                // Emit message to the clients in the same discussion room
                io.to(discussionId).emit("receiveMessage", message);
                console.log("Message sent to room:", discussionId);
            } catch (error) {
                console.error("Error saving message:", error.message);
            }
        });

        // When user disconnects
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
