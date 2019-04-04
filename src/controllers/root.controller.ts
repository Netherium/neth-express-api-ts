import { Request, Response, Router } from 'express';

export class RootController {
  public router = Router();

  constructor() {
    this.router.get('/', this.init);
  }

  private init = (req: Request, res: Response) => {
    return res.status(200).json({'message': `Welcome to Neth-Express-Api-TS. You can find endpoints documentation http://${process.env.ADDRESS}:${process.env.PORT}/api/docs`});
  }
}