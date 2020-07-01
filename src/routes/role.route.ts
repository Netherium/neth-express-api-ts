import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

export class RoleRoute {
  public router = Router();

  constructor() {
    const controller = new RoleController();
    this.router.get('/', controller.list);
    this.router.get('/:id', controller.show);
    this.router.post('/', controller.create);
    this.router.put('/:id', controller.update);
    this.router.delete('/:id', controller.delete);
  }
}
