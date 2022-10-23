import { IUser } from "../../../app/entities/User";
import Repository from "./Repository";
import UserModel from "..//model/User";
import { IFriend } from "../../../app/entities/Friend";
class UserRepository extends Repository<IUser> {
  constructor() {
    super(UserModel as any);
  }
  async getOneByIdProvider(idProvider: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ idProvider }).exec();
    if (!user) return null;
    return user as any;
  }
  async getUsersByEmail(email: string, myId: string): Promise<IUser[] | null> {
    const users = await UserModel.find({ email, _id: { $ne: myId } }).exec();
    if (!users) return null;
    const result = users.map((e: any) => {
      const doc = e._doc;
      const isFriend = !!e?.friends?.find(
        (friend: any) => String(friend.userId) === String(myId)
      );
      doc.isFriend = isFriend;
      return doc;
    });
    return result as any;
  }
  async GetOnePopulate(id: string): Promise<IUser[] | null> {
    const user = await UserModel.findOne({ _id: id })
      .populate({
        path: "friends.userId",
        select: "_id email email avatar name",
      })
      .populate({
        path: "friendInvites.userId",
        select: "_id email email avatar name",
      })
      .exec();
    if (!user) return null;
    return user as any;
  }
  async GetFriends(id: string): Promise<IFriend[] | null> {
    const user: any = await UserModel.findOne({ _id: id })
      .populate({
        path: "friends.userId",
        select: "_id email email avatar name",
      })
      .exec();
    if (!user) return null;

    return user.friends;
  }
}
export default new UserRepository();
