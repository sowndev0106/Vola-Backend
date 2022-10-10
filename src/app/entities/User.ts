import { IFriend, IFriendInvite } from "./Friend";

export interface IUser {
  _id?: string;
  name: string;
  avatar?: string;
  email: string;
  provider: string;
  idProvider: string;
  phone?: string;
  sex?: boolean;
  friendInvites?: IFriendInvite[];
  friends?: IFriend[];
  dateOfBirth?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
