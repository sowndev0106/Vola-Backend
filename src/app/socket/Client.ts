import { Socket } from "socket.io";
import SocketServer from ".";
import logger from "../../infrastructure/logger";
import addUserHandler from "./handler/addUserHandler";
import clientSendMessageHandler, { IClientSendMessage } from "./handler/clientSendMessageHandler";

export default class Client {
    private client:Socket;
    private socketServer: SocketServer;
    constructor(client:Socket,socketServer: SocketServer, token:string){
        this.client = client;
        this.socketServer = socketServer

        // add user to list users
        addUserHandler.bind(this)(this.socketServer.users, token).catch(err=>this.error(client,err))

        this.addlistenEvent()

    }
    addlistenEvent(){
        this.client.on("client-send-message", this.onClientSendMessage.bind(this));
        this.client.on("disconnect", this.onDiscornect.bind(this));
    } 
    onDiscornect(){
        logger.warn(`Diconnect from ${this.client.id}`)
    }
    onClientSendMessage(data:IClientSendMessage){
        clientSendMessageHandler(data, this.socketServer)
    }
    error(client: Socket, error: any) {
        logger.error('Socket error: ' , error)
        client.emit("error", error);
    }
}