import CollectErrors from "../errors/CollectErrors";

export default abstract class Handler<Request> {
  protected _colectErrors: CollectErrors = new CollectErrors();
  protected abstract validate(request: Request): Promise<any>;
  public abstract handle(request: Request): Promise<null>;
}
