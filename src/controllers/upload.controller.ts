import { Request, Response } from 'express';
import MediaObjectModel from '../models/media.object.model';
import {
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_UNPROCESSABLE_ENTITY
} from '../helpers/http.responses';
import { UploadService } from '../services/upload.service';

/** UploadController.ts */
export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.uploadService = new UploadService();
  }

  /** UploadController.list() */
  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const uploadCollection = await MediaObjectModel.find();
      return HTTP_OK(res, uploadCollection);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /** UploadController.show() */
  public async show(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    try {
      const mediaObjectEntry = await MediaObjectModel.findOne({_id: id});
      if (!mediaObjectEntry) {
        return HTTP_NOT_FOUND(res);
      }
      return HTTP_OK(res, mediaObjectEntry);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /** UploadController.create() */
  public async create(req: Request, res: Response): Promise<Response> {
    if (!req.files || Object.keys(req.files).length === 0 || typeof req.files.file !== 'object' || req.files.file === null) {
      return HTTP_UNPROCESSABLE_ENTITY(res);
    }
    // TODO Check for all allowed media types
    // @ts-ignore
    // if (!isMimeTypePhoto(req.files.file.mimetype)) {
    //   return HTTP_UNSUPPORTED_MEDIA_TYPE(res);
    // }
    try {
      // @ts-ignore
      const uploadedFile = await this.uploadService.uploadFile(req.files.file, req.body.alternativeText, req.body.caption);
      const uploadFileEntry = new MediaObjectModel(uploadedFile);
      const uploadFileCreated = await uploadFileEntry.save();
      return HTTP_CREATED(res, uploadFileCreated);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /** UploadController.update() */
  public async update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const uploadUpdateData = {
      ...(req.body.alternativeText) && {alternativeText: req.body.alternativeText},
      ...(req.body.caption) && {caption: req.body.caption}
    };
    try {
      const uploadUpdated = await MediaObjectModel.findByIdAndUpdate(id, uploadUpdateData, {new: true});
      if (!uploadUpdated) {
        return HTTP_NOT_FOUND(res);
      }
      return HTTP_OK(res, uploadUpdated);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /** UploadController.delete() */
  public async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    try {
      // TODO DELETE FILE FROM PROVIDER
      await MediaObjectModel.findByIdAndDelete(id);
      return HTTP_NO_CONTENT(res);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }
}
