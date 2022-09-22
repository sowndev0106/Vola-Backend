import Handler from "../Handler";

export interface IAddMessageHandler {
  userSend: string;
  room: string;
  content: string;
}
class AddMessageHandler extends Handler<IAddMessageHandler> {
  protected async validate(request: IAddMessageHandler) {}
  public async handle(request: IAddMessageHandler): Promise<any> {}
}

export default new AddMessageHandler();
