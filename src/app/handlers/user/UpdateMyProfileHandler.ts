import { Response } from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import StringValidate from "../../../util/validate/StringValidate";
import Handler from "../Handler";
export interface IUpdateMyProfileRequest {
  _id?: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  sex?: boolean;
  dateOfBirth?: Date;
}
interface IInputValidated {
  // _id: string;
  // name:string;
  // avatar:string;
  // email:string;
  // sex:boolean;
  // dateOfBirth: Date
}

class UpdateMyProfileHandler extends Handler<IUpdateMyProfileRequest> {
  protected async validate(request: IUpdateMyProfileRequest):Promise <IInputValidated> {
    const id =  this._colectErrors.collect("id", () => StringValidate(request._id));
    const name =  this._colectErrors.collect("name", () => StringValidate(request.name));
    const avatar =  this._colectErrors.collect("avatar", () => StringValidate(request.avatar));
    
    return name;
  }

  public async handle(request: IUpdateMyProfileRequest): Promise<any> {
    await this.validate(request);
    // const user = await UserRepository.findOneById(request._id);
    // const rooms = await RoomRepository.getRoomsByUser(request., 10, 0);
    // return { user, rooms };
  }
}

export default new UpdateMyProfileHandler();

// _id?: string;
// name: string;
// avatar?: string;
// email: string;
// provider: string;
// idProvider: string;
// phone?: string;
// sex?: boolean;
// dateOfBirth?: Date;