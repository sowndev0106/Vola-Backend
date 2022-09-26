"use strict";
const socket = io("http://localhost:5000", { query: `token=${token}` });
const sendMessageSocket = (roomId, content, type) => {
    socket.emit("client-send-message", { token, roomId, content, type });
};
socket.on("server-send-message", (data) => {
    const messages = document.getElementById("messages");
    console.log(data);
});
