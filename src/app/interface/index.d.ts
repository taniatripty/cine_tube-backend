import { IRequest } from "./requestUser.interface";


declare global {
  namespace Express {
    interface Request {
      user: IRequest;
    }
  }
}
