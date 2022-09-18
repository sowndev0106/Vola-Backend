export interface IRoom {
  users: UserRoom[];
  _id?: string;
  name?: string;
  avatar?: string;
  message: Message[];
  typeRoom: TypeRoom;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserRoom {
  _id: string;
  lastMessageRead?: string;
  deletedAt?: Date | null;
}
export interface Message {
  _id: string;
  user: string;
  content: string;
  type: TypeMeesage;
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
