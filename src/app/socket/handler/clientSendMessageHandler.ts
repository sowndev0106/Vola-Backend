import SocketServer from "..";

export interface IClientSendMessage{
    token:string;
    groupId:string;
    content:string;
}
export default (data:IClientSendMessage, socketServer:SocketServer)=>{
    
}