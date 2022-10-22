import express, { Request, Response } from "express";
import "express-async-errors";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import route from "./app/route";
import "./infrastructure/mongoose";
import http from "http";
import Socket from "./app/socket";
import fs from "fs";
import socketOutSiteHandler from "./app/socket/handlerOutsite";
const port = Number(process.env.PORT || 5000);
const app = express();
const options = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
};
const server = http.createServer(app);

app.use(cors());

// config socket
const socket = new Socket(server);
socketOutSiteHandler(socket.getSocket());

app.use(morgan("dev"));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use("/api", route);
// 404
app.use("*", (req: Request, res: Response) =>
  res.status(404).send("url not found")
);

server.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});
