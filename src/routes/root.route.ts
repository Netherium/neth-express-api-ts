import { Router } from 'express';
import { Auth } from '../middleware/auth';
import { RootController } from '../controllers/root.controller';

export class RootRoute {
  public router = Router();

  constructor() {
    const controller = new RootController();
    this.router.get('/', controller.show);
  }
}
