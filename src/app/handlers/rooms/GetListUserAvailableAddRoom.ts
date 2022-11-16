import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IGetListUserAvailableAddRoom {
  myId: string;
  roomId: string;
}
class GetListUserAvailableAddRoom extends Handler<IGetListUserAvailableAddRoom> {
  protected async validate(request: IGetListUserAvailableAddRoom) {
    const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!request.roomId || !regexIdMongo.test(request.roomId)) {
      throw new ValidationError({ roomId: "roomId invalid" });
    }
  }
  public async handle(request: IGetListUserAvailableAddRoom): Promise<any> {
    await this.validate(request);
    const user = await UserRepository.GetOnePopulate(request.myId);
    console.log(user?.friends);
    const room = await RoomRepository.getRoomSimplePopulate(request.roomId);
    console.log(room?.users);

    const listFiendAvalible = user?.friends?.filter((friend: any) => {
      return !room?.users.find(({ user }: any) => {
        return String(user._id) === String(friend.userId._id);
      });
    });
    return listFiendAvalible;
  }
}

export default new GetListUserAvailableAddRoom();
