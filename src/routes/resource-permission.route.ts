import { Router } from 'express';
import { ResourcePermissionController } from '../controllers/resource-permission.controller';

export class ResourcePermissionRoute {
  public router = Router();

  constructor() {
    const controller = new ResourcePermissionController();
    this.router.get('/', controller.list);
    this.router.get('/:id', controller.show);
    this.router.post('/', controller.create);
    this.router.put('/:id', controller.update);
    this.router.delete('/:id', controller.delete);
  }
}
