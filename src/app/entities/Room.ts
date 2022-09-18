export interface IRoom {
  users: UserRoom[];
  id?: string;
  name?: string;
  avatar?: string;
  message: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserRoom {
  id: string;
  lastMessageRead?: string;
}
export interface Message {
  id: string;
  user: string;
  content: string;
  type: TypeMeesage;
}
export enum TypeMeesage {
  File = "file",
  Text = "text",
  Image = "image",
}
