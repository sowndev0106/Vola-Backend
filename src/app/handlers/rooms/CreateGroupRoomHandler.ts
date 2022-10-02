import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import { IRoom, TypeRoom } from "../../entities/Room";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface ICreateGroupRoomHandler {
  myId: string;
  avatar: string;
  name: string;
  userIds: string[];
}
interface IInputValidated {
  userIds: Array<{ _id: string }>;
  avatar?: string;
  name: string;
}
class CreateGroupRoomHandler extends Handler<ICreateGroupRoomHandler> {
  protected async validate(
    request: ICreateGroupRoomHandler
  ): Promise<IInputValidated> {
    if (!request.userIds) {
      throw new ValidationError({ userIds: "userIds is require" });
    }
    if (!request.name) {
      throw new ValidationError({ name: "name is require" });
    }
    const ids = new Set(request.userIds); // remove element duplicated
    const idsValidated: Array<{ _id: string }> = [];
    ids.forEach(async (e) => {
      if (e == request.myId) return;
      const id = await this.checKValidateUserId(e);
      id && idsValidated.push({ _id: id });
    });
    idsValidated.push({ _id: request.myId });
    return {
      userIds: idsValidated,
      name: request.name,
      avatar: request.avatar,
    };
  }

  public async handle(request: ICreateGroupRoomHandler): Promise<any> {
    const input = await this.validate(request);
    const room: IRoom = {
      messages: [],
      typeRoom: TypeRoom.Group,
      users: input.userIds,
      avatar: request.avatar,
      name: request.name,
    };
    console.log(room);
    const result = await RoomRepository.add(room);

    return result;
  }
  private async checKValidateUserId(userId: string): Promise<string | null> {
    const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!regexIdMongo.test(userId)) return null;
    const user = await UserRepository.findOneById(userId);
    if (!user) {
      return null;
    }
    return userId;
  }
}
export default new CreateGroupRoomHandler();
