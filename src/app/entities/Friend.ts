export interface IFriend {
  userSend: string;
  useRevice: string;
  message: string;
  status: StatusFriend;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum StatusFriend {
  Accepted,
  UnAccepted,
  Stranger,
  Deny,
}
