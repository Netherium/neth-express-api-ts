import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import * as fileUpload from 'express-fileupload';

export class UploadRoute {
  public router = Router();

  constructor() {
    const controller = new UploadController();
    this.router.get('/', controller.list);
    this.router.get('/:id', controller.show);
    this.router.post('/', fileUpload(), controller.create);
    this.router.put('/:id', controller.update);
    this.router.delete('/:id', controller.delete);
  }
}
