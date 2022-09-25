"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import logger from '..//logger/Logger';
// logger.info();
console.log(`MONGO # Connecting to ${process.env.MONGO_URL}/${process.env.MONGO_DB}`);
const connect = () => {
    mongoose_1.default
        .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
        .then(() => {
        return console.log(`MONGO # Successfully connected to ${process.env.MONGO_URL}/${process.env.MONGO_DB}`);
    })
        .catch((error) => {
        console.log(`MONGO # Error connecting to ${process.env.MONGO_URL}/${process.env.MONGO_DB}`, error);
        return process.exit(1);
    });
};
connect();
mongoose_1.default.connection.on("disconnected", connect);
