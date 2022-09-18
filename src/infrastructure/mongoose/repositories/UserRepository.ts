import { IUser } from "../../../app/entities/User";
import Repository from "./Repository";
import UserModel from "..//model/User";
class UserRepository extends Repository<IUser> {
  constructor() {
    super(UserModel as any);
  }
  async getOneByIdProvider(idProvider: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ idProvider }).exec();
    if (!user) return null;
    return user as any;
  }
  async getOneByEmail(email: string): Promise<IUser | null> {
    const user = (await UserModel.findOne({ email }).exec()) as any;
    if (!user) return null;
    return user._doc as any;
  }
}
export default new UserRepository();
