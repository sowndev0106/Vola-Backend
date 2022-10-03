import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import { TypeMeesage } from "../../entities/Room";
import Handler from "../Handler";

export interface IGetMessagesHandler {
  limit: number;
  page: number;
  roomId: string;
  type: string | null;
}
class GetMessagesHandler extends Handler<IGetMessagesHandler> {
  protected async validate(
    request: IGetMessagesHandler
  ): Promise<IGetMessagesHandler> {
    let { limit, page, roomId, type } = request;
    if (!limit) limit = 10;
    if (!page) page = 1;
    if (!Object.values(TypeMeesage).includes(type as TypeMeesage)) type = null;
    return {
      limit,
      page,
      roomId,
      type,
    };
  }
  public async handle(request: IGetMessagesHandler): Promise<any> {
    const { limit, page, roomId, type } = await this.validate(request);
    const offset = limit * (page - 1);
    const messages = await RoomRepository.getMessagesByRoom(
      roomId,
      limit,
      offset,
      type as TypeMeesage
    );
    return messages;
  }
}

export default new GetMessagesHandler();
