export interface IUser {
  id?: string;
  name: string;
  avatar?: string;
  email: string;
  provider: string;
  idProvider: string;
  phone?: string;
  sex?: boolean;
  dateOfBirth?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
