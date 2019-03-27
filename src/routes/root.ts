import { Request, Response, Router } from 'express';


class Root {
  public router: Router;

  public constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get('/', (req: Request, res: Response) => {
      return res.status(200).json({'message': 'Welcome to api'});
    });
  }
}

export default new Root().router;
