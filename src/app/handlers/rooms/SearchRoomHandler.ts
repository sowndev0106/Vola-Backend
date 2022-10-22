import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface ISearchRoomHandler {
  myId: string;
  q: string;
}
interface IInputValidated {
  q: string;
  myId: string;
}
class GetMyProfileHandler extends Handler<ISearchRoomHandler> {
  protected async validate(
    request: ISearchRoomHandler
  ): Promise<IInputValidated> {
    const q: string = this._colectErrors.collect("q", () =>
      StringValidate(request.q)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { q: q.toLowerCase(), myId: request.myId };
  }
  public async handle(request: ISearchRoomHandler): Promise<any> {
    const input = await this.validate(request);
    const rooms = await RoomRepository.getRoomsByUser(input.myId, 1000, 0);
    const result = rooms.filter((e: any) => {
      if (e?.name?.toLowerCase().indexOf(input.q) != -1) {
        return true;
      }
      return false;
    });
    return result;
  }
}

export default new GetMyProfileHandler();
