export interface IRoom {
  users: IUserRoom[];
  _id?: string;
  name?: string;
  avatar?: string;
  messages: IMessage[];
  typeRoom: TypeRoom;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserRoom {
  _id: string;
  lastMessageRead?: string;
  deletedAt?: Date | null;
  missing?: number;
}
export interface IMessage {
  _id?: string;
  user: string;
  content: string;
  type: TypeMeesage;
  reacts: {
    emoji: string;
    user: string;
    createAt: string;
  }[];
  createdAt: Date;
}
export enum TypeMeesage {
  File = "file",
  Text = "text",
  Image = "image",
}
export enum TypeRoom {
  Private = "private",
  Group = "group",
}
