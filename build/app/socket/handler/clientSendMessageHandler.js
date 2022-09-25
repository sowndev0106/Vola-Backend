"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../../entities/Room");
exports.default = (data, socketServer) => {
    const message = {
        user: "user",
        content: "content",
        type: Room_1.TypeMeesage.Text,
        createdAt: new Date(),
    };
    socketServer.serverSendMessageToUsers(["6326c25a880e6552ccfaa26e"], message);
};
