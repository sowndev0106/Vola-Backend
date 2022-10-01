import {
  IMessage,
  IRoom,
  IUserRoom,
  TypeMeesage,
  TypeRoom,
} from "../../../app/entities/Room";
import Repository from "./Repository";
import RoomModel from "../model/Room";
import UserModel from "../model/User";
import UserRepository from "./UserRepository";
import mongoose, { mongo } from "mongoose";
class RoomRepository extends Repository<IRoom> {
  constructor() {
    super(RoomModel as any);
  }
  async getRoomsByUser(userId: string, limit: number, offset: number) {
    const rooms = await RoomModel.find(
      { "users._id": userId },
      { __v: 0, messages: { $slice: -1 } }
    )
      .limit(limit)
      .skip(offset)
      .sort({ updatedAt: -1 })
      .exec();
    const result = rooms.map(async (room: any) => {
      // private room then add avatar and name room
      if (room.typeRoom == TypeRoom.Private) {
        // because Private room only 2 user and we find user disserent me
        const id =
          room.users[0]._id == userId ? room.users[0]._id : room.users[1]._id;
        // add avatar and different with my user
        const user = await UserRepository.findOneById(id);
        room.avatar = user?.avatar;
        room.name = user?.name;
      }
      delete room.users;
      return room;
    });
    return Promise.all(result);
  }
  async getRoomSimpleById(id: string): Promise<IRoom | null> {
    const room = await RoomModel.findOne({ _id: id }, { messages: 0 }).exec();
    if (!room) return null;
    return room as unknown as IRoom;
  }
  async getPrivateRoomByUser(myId: string, userId: string) {
    const user = await UserRepository.findOneById(userId);
    if (!user) throw new Error("userId not found");

    var room: any = await RoomModel.findOne(
      {
        typeRoom: TypeRoom.Private,
        "users._id": {
          $all: [myId, userId],
        },
      },
      { __v: 0, messages: { $slice: -1 } }
    );

    if (!room) {
      // create new room private
      room = await this.add({
        messages: [],
        users: [{ _id: myId }, { _id: userId }],
        typeRoom: TypeRoom.Private,
      });
    }
    // add avatar and name user in room
    if (!room.avatar) room.avatar = user.avatar;
    if (!room.name) room.name = user.name;

    return room;
  }
  async addMessage(message: IMessage, roomId: string, userSeen:string[]) {
    var room = await this.getRoomSimpleById(roomId);
    message._id = mongoose.Types.ObjectId().toString();
    if(!room) throw new Error(`Room ${roomId} does not exist`);
    console.log(userSeen)
    const users:IUserRoom[] = room.users.map((user:IUserRoom )=> {
      console.log(user._id , ' - ', userSeen.includes(user._id))
      if(userSeen.includes(String(user._id))){
        // seen message
        user.lastMessageRead = message._id;
        user.missing = 0;
      }else{
        if(user.missing)
          user.missing += 1;
        else 
          user.missing =1    
      }
      return user
    })
     await RoomModel.updateOne(
      { _id: roomId },
      { $push: { messages: message } ,$set:{users:users}}
    );
    return message;
  }
  async getMessagesByRoom(
    roomId: string,
    limit: number,
    offset: number,
    type: TypeMeesage | null
  ) {
    const aggregates: any[] = [];
    aggregates.push({ $match: { _id: mongoose.Types.ObjectId(roomId) } });

    if (type) {
      aggregates.push({
        $project: {
          messages: {
            $filter: {
              input: "$messages",
              as: "messages",
              cond: { $eq: ["$$messages.type", type] },
            },
          },
        },
      });
    }
    aggregates.push({ $unwind: "$messages" });
    aggregates.push({
      $lookup: {
        from: "users",
        localField: "messages.user",
        foreignField: "_id",
        as: "messages.user",
      },
    });
    aggregates.push({ $unwind: "$messages.user" });
    aggregates.push({
      $project: {
        _id: "$messages._id",
        content: "$messages.content",
        type: "$messages.type",
        user: "$messages.user",
        createdAt: "$messages.createdAt",
      },
    });
    aggregates.push({ $sort: { createdAt: 1 } });
    aggregates.push({ $skip: offset });
    aggregates.push({ $limit: limit });

    const messages = await RoomModel.aggregate(aggregates).exec();
    if (!messages) return [];
    return messages as IMessage[];
  }
}
export default new RoomRepository();
