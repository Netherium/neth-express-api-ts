import { UploadedFile } from 'express-fileupload';
import * as crypto from 'crypto';
import { basename, extname } from 'path';
import * as filenamify from 'filenamify';
import { promises as fs } from 'fs';
import * as AWS from 'aws-sdk';
import sharp = require('sharp');

export interface MediaObject {
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  path: string;
  provider: string;
  provider_metadata: string;
  thumbnail?: {
    hash: string;
    ext: string;
    mime: string;
    width: number;
    height: number;
    size: number;
    url: string;
    path: string;
  };
}

export class UploadService {

  public isLocalProvider: boolean;

  constructor() {
    this.isLocalProvider = !(process.env.UPLOAD_PROVIDER === 'do' || process.env.UPLOAD_PROVIDER === 'aws');
  }

  private static async localProviderHandler(localPath: string, data: Buffer, action: 'put' | 'delete') {
    return await fs.writeFile(localPath, data);
  }

  private static async remoteProviderHandler(path: string, mime: string, data: Buffer, action: 'put' | 'delete') {
    const s3 = new AWS.S3({
        endpoint: process.env.UPLOAD_PROVIDER_ENDPOINT,
        accessKeyId: process.env.UPLOAD_PROVIDER_KEY,
        secretAccessKey: process.env.UPLOAD_PROVIDER_SECRET
      }
    );
    const params: AWS.S3.PutObjectRequest = {
      Body: data,
      Bucket: process.env.UPLOAD_PROVIDER_BUCKET,
      Key: path,
      ACL: 'public-read',
      ContentType: mime
    };
    return await s3.putObject(params).promise();
  }

  public async uploadFile(file: UploadedFile, alternativeText: string = null, caption: string = null) {
    try {
      const {mediaObject, fileBuffer, thumbBuffer} = await this.getMediaObjectData(file, alternativeText, caption);
      if (this.isLocalProvider) {
        await UploadService.localProviderHandler(`./${mediaObject.path}`, fileBuffer, 'put');
        if (isMimeTypePhoto(mediaObject.mime)) {
          await UploadService.localProviderHandler(`./${mediaObject.thumbnail.path}`, thumbBuffer, 'put');
        }
      } else {
        await UploadService.remoteProviderHandler(`${mediaObject.path}`, mediaObject.mime, fileBuffer, 'put');
        if (isMimeTypePhoto(mediaObject.mime)) {
          // tslint:disable-next-line:max-line-length
          await UploadService.remoteProviderHandler(`${mediaObject.thumbnail.path}`, mediaObject.thumbnail.mime, thumbBuffer, 'put');
        }
      }
      return mediaObject;
    } catch (err) {
      return false;
    }
  }

  // tslint:disable-next-line:max-line-length
  private async getMediaObjectData(file: UploadedFile, alternativeText: string, caption: string): Promise<{ mediaObject: MediaObject, fileBuffer: Buffer, thumbBuffer: Buffer }> {
    const ext = extname(file.name);
    const baseFileName = filenamify(basename(file.name, ext));
    const hash = baseFileName + '_' + crypto.randomBytes(5).toString('hex');
    let filePath;
    let fileUrl;
    if (this.isLocalProvider) {
      filePath = `${process.env.UPLOAD_PROVIDER_FOLDER}/${hash}${ext}`;
      fileUrl = `http://${process.env.ADDRESS}:${process.env.PORT}/${filePath}`;
    } else {
      filePath = `${hash}${ext}`;
      fileUrl = `https://${process.env.UPLOAD_PROVIDER_BUCKET}.${process.env.UPLOAD_PROVIDER_ENDPOINT}/${filePath}`;
    }
    let mediaObject: MediaObject = {
      name: baseFileName,
      alternativeText,
      caption,
      width: null,
      height: null,
      hash,
      ext,
      mime: file.mimetype,
      size: file.size,
      url: fileUrl,
      path: filePath,
      provider: process.env.UPLOAD_PROVIDER,
      provider_metadata: null
    };

    let thumbBuffer: Buffer;
    if (isMimeTypePhoto(mediaObject.mime)) {
      const metadata = await sharp(file.data).metadata();
      const thumbnailHash = `thumbnail_${hash}`;
      const thumbnailPath = this.isLocalProvider ? `${process.env.UPLOAD_PROVIDER_FOLDER}/${thumbnailHash}${ext}` : `${thumbnailHash}${ext}`;
      const thumbnailUrl = this.isLocalProvider ? `http://${process.env.ADDRESS}:${process.env.PORT}/${thumbnailPath}` : `https://${process.env.UPLOAD_PROVIDER_BUCKET}.${process.env.UPLOAD_PROVIDER_ENDPOINT}/${thumbnailPath}`;
      thumbBuffer = await sharp(file.data).resize(80, 80).toBuffer();
      const thumbnailMetadata = await sharp(thumbBuffer).metadata();
      mediaObject = {
        ...mediaObject,
        width: metadata.width,
        height: metadata.height,
        thumbnail: {
          width: thumbnailMetadata.width,
          height: thumbnailMetadata.height,
          hash: thumbnailHash,
          ext: mediaObject.ext,
          mime: mediaObject.mime,
          size: thumbnailMetadata.size,
          url: thumbnailUrl,
          path: thumbnailPath
        }
      };
    }
    return {mediaObject, fileBuffer: file.data, thumbBuffer};
  }
}

export function isMimeTypePhoto(mime: string) {
  const photoTypes = [
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/webp'
  ];
  return photoTypes.indexOf(mime) > -1;
}

