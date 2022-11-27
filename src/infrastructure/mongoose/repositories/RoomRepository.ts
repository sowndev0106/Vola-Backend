import {
  IMessage,
  IRoom,
  IUserRoom,
  TypeMeesage,
  TypeRoom,
} from "../../../app/entities/Room";
import Repository from "./Repository";
import RoomModel from "../model/Room";
import UserRepository from "./UserRepository";
import mongoose, { mongo } from "mongoose";
import { deleteFileS3ByLink } from "../../s3/handler";
class RoomRepository extends Repository<IRoom> {
  constructor() {
    super(RoomModel as any);
  }
  async getRoomsByUser(userId: string, limit: number, offset: number) {
    const rooms = await RoomModel.find(
      { "users._id": userId },
      { __v: 0, messages: { $slice: -1 } }
    )
      .populate({ path: "messages.reacts.user", select: "_id email avatar " })
      .limit(limit)
      .skip(offset)
      .sort({ updatedAt: -1 })
      .exec();
    const result = rooms.map(async (room: any) => {
      // private room then add avatar and name room
      if (room.typeRoom == TypeRoom.Private) {
        // because Private room only 2 user and we find user disserent me
        const id =
          String(room.users[0]._id) == String(userId)
            ? room.users[1]._id
            : room.users[0]._id;
        // add avatar and different with my user
        const user = await UserRepository.findOneById(id);
        room.avatar = user?.avatar;
        room.name = user?.name || user?.email;
      }
      delete room.users;
      return room;
    });
    return Promise.all(result);
  }
  async getRoomSimpleById(id: string): Promise<IRoom | null> {
    const room: any = await RoomModel.findOne(
      { _id: id },
      { messages: 0 }
    ).exec();
    if (!room) return null;
    room.messages = [];
    return room as unknown as IRoom;
  }
  async getRoomSimplePopulate(id: string): Promise<IRoom | null> {
    const room: any = await RoomModel.findOne({ _id: id }, { messages: 0 })
      .populate("users._id")
      .exec();
    if (room) room.messages = [];
    if (!room) return null;
    room.users = room.users?.map((e: any) => {
      return {
        missing: e.missing,
        user: e._id,
      };
    });
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
  async addMessage(message: IMessage, roomId: string) {
    var room = await this.getRoomSimpleById(roomId);
    message._id = mongoose.Types.ObjectId().toString();
    if (!room) throw new Error(`Room ${roomId} does not exist`);
    const users: IUserRoom[] = room.users.map((user: IUserRoom) => {
      if (message.user == String(user._id)) {
        // seen message
        user.lastMessageRead = message._id;
        user.missing = 0;
      } else {
        if (user.missing) user.missing += 1;
        else user.missing = 1;
      }
      return user;
    });
    await RoomModel.updateOne(
      { _id: roomId },
      { $push: { messages: message }, $set: { users: users } }
    );
    return message;
  }
  async addUserIntoRoom(userId: string, roomId: string) {
    var room = await this.getRoomSimpleById(roomId);
    if (!room) throw new Error(`Room ${roomId} does not exist`);
    const userExist = room.users.find((e) => e._id == userId);
    if (userExist) throw new Error("User exist in room");
    await RoomModel.updateOne(
      { _id: roomId },
      { $push: { users: { _id: userId } } }
    );
    room.users.push({ _id: userId });
    return room;
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
        reacts: "$messages.reacts",
        createdAt: "$messages.createdAt",
      },
    });
    aggregates.push({ $sort: { createdAt: -1 } });
    aggregates.push({ $skip: offset });
    aggregates.push({ $limit: limit });

    const messages = await RoomModel.aggregate(aggregates).exec();
    if (!messages) return [];
    return messages.reverse() as IMessage[];
  }
  async removeUserFromRoom(userId: string, roomId: string, myId: string) {
    var room = await this.getRoomSimpleById(roomId);
    if (String(room?.owner) != String(myId)) {
      throw new Error("you don't have permission to access");
    }
    if (!room) throw new Error(`Room ${roomId} does not exist`);
    const userExist = room.users.find((e) => e._id == userId);
    if (!userExist) throw new Error("User not exist in room");
    await RoomModel.updateOne(
      { _id: roomId },
      { $pull: { users: { _id: userId } } }
    );
    room.users = room.users.filter((e) => e._id != userId);
    return room;
  }
  async updateNameRoom(userId: string, name: string, roomId: string) {
    var room = await this.getRoomSimpleById(roomId);
    if (!room) throw new Error(`Room ${roomId} does not exist`);
    const userExist = room.users.find((e) => e._id == userId);
    if (userExist) throw new Error("User not permisson");
    await RoomModel.updateOne({ _id: roomId }, { name });
    room.name = name;
    return room;
  }
  async updateAvatarRoom(userId: string, avatar: string, roomId: string) {
    var room = await this.getRoomSimpleById(roomId);
    if (!room) throw new Error(`Room ${roomId} does not exist`);
    const userExist = room.users.find((e) => e._id == userId);
    if (userExist) throw new Error("User not permisson");
    await RoomModel.updateOne({ _id: roomId }, { avatar });

    // delete avatar old
    // deleteFileS3ByLink(room.avatar);
    room.avatar = avatar;

    return room;
  }
  async changeOwnerRoom(newOwner: string, roomId: string, myId: string) {
    var room = await this.getRoomSimpleById(roomId);
    if (String(room?.owner) != String(myId)) {
      // throw new Error("you don't have permission to access");
    }
    if (!room) throw new Error(`Room ${roomId} does not exist`);
    const userExist = room.users.find((e) => e._id == newOwner);
    if (!userExist) throw new Error("User not exist in room");
    await RoomModel.updateOne({ _id: roomId }, { owner: newOwner });
    room.owner = newOwner;
    return room;
  }
  async deleteMessage(messageId: string, roomId: string, myId: string) {
    const result = await RoomModel.updateOne(
      { _id: roomId, "messages._id": messageId },
      {
        $set: {
          "messages.$.type": TypeMeesage.Unsend,
        },
      }
    );
    return await this.getRoomSimpleById(roomId);
  }
  async reactMessage(
    messageId: string,
    roomId: string,
    myId: string,
    react: string
  ) {
    const room: any = await RoomModel.findById(roomId);
    const reacts: any = [];
    let isAlreadyReact = false;
    room?.reacts?.forEach((e: any) => {
      if (String(e?.user) == String(myId)) {
        // already react
        e.emoji = react;
        isAlreadyReact = true;
      }
      reacts.push(e);
    });
    if (!isAlreadyReact) {
      reacts.push({ emoji: react, user: myId, createAt: new Date() });
    }

    // add new React
    await RoomModel.updateOne(
      { _id: roomId, "messages._id": messageId },
      {
        $set: {
          "messages.$.reacts": reacts,
        },
      }
    );

    return await this.getRoomSimpleById(roomId);
  }

  async GetReactMessage(messageId: string, roomId: string, myId: string) {
    // add new React
    const result: any = await RoomModel.findOne(
      {
        _id: roomId,
        "messages._id": messageId,
      },
      { "messages.$": 1 }
    ).populate({ path: "messages.reacts.user", select: "_id email avatar " });
    const reacts = result?.messages[0]?.reacts;
    return reacts ? reacts : [];
  }
  async readMessageInRoom(roomId: string, myId: string) {
    // add new React
    const result: any = await RoomModel.updateOne(
      {
        _id: roomId,
        "users._id": myId,
      },
      {
        $set: {
          "users.$.missing": 0,
        },
      }
    );
    return result;
  }
}

export default new RoomRepository();
