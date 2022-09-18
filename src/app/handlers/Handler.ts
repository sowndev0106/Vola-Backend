export default abstract class Handler<Request> {
  //   @inject("ErrorCollector") protected _ec!: ErrorCollector;
  protected abstract validate(request: Request): Promise<any>;
  public abstract handle(request: Request): Promise<null>;
}
