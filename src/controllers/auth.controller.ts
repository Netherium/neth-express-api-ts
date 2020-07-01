import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NO_CONTENT, HTTP_NOT_FOUND, HTTP_OK, HTTP_UNAUTHORIZED } from '../helpers/http.responses';
import * as jwt from 'jsonwebtoken';
import RoleModel from '../models/role.model';

/**
 * auth.controller.ts
 * @description :: Server-side logic for managing users.
 */
export class AuthController {

  /**
   * AuthController.login()
   */
  public async getToken(req: Request, res: Response) {
    try {
      const userEntry: any = await UserModel.findOne({email: req.body.email}).populate('role');
      if (!userEntry || !req.body.password || !userEntry.validPassword(req.body.password)) {
        return HTTP_UNAUTHORIZED(res);
      }
      const token = await userEntry.generateJWT();
      const decoded = jwt.verify(token, process.env.secret);
      return HTTP_CREATED(res, {token: await userEntry.generateJWT(), decoded: decoded});
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /**
   * AuthController.profile()
   */
  public async show(req: Request, res: Response) {
    const authUser = res.locals.authUser;
    try {
      const userEntry = await UserModel.findOne({_id: authUser._id}).populate('role').exec();
      if (!userEntry) {
        return HTTP_NOT_FOUND(res);
      }
      return HTTP_OK(res, userEntry);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /**
   * AuthController.register()
   */
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const publicRole = await RoleModel.findOne({isAuthenticated: false});
      const userEntry = new UserModel({
        email: req.body.email,
        name: req.body.name,
        role: publicRole,
        isVerified: false,
        password: req.body.password
      });
      const userCreated = await userEntry.save();
      return HTTP_CREATED(res, userCreated);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /**
   * AuthController.update()
   */
  public async update(req: Request, res: Response) {
    const authUser = res.locals.authUser;
    const userEntryModified: any = {
      ...(req.body.email) && {email: req.body.email},
      ...(req.body.name) && {name: req.body.name},
      ...(req.body.password) && {password: req.body.password}
    };
    try {
      const userEntry = await UserModel.findByIdAndUpdate(authUser._id, userEntryModified, {new: true}).populate('role').exec();
      if (!userEntry) {
        return HTTP_NOT_FOUND(res);
      }
      return HTTP_OK(res, userEntry);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /**
   * AuthController.delete()
   */
  public async delete(req: Request, res: Response) {
    const id = res.locals.authUser;
    try {
      await UserModel.findByIdAndDelete(id);
      return HTTP_NO_CONTENT(res);
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }

  /**
   * AuthController.init()
   * Initializes the application
   * - Creates 2 basic roles, 1 Public and 1 Admin
   * - Creates an Access Control List
   * - Creates admin user based on .env configuration
   */
  public async init(req: Request, res: Response) {
    const publicRoleEntry = new RoleModel(
      {
        name: 'Public',
        description: 'Unauthenticated user',
        isAuthenticated: false
      }
    );
    const adminRoleEntry = new RoleModel(
      {
        name: 'Admin',
        description: 'Top level authenticated user',
        isAuthenticated: true
      }
    );
    const adminUserEntry = new UserModel({
      email: process.env.ADMIN_EMAIL,
      name: process.env.ADMIN_NAME,
      role: adminRoleEntry,
      isVerified: true,
      password: process.env.ADMIN_PASSWORD,
    });
    const userExists = await UserModel.findOne({email: adminUserEntry.get('email')});
    const rolesExist = await RoleModel.findOne({
      $or: [
        {name: publicRoleEntry.get('name')},
        {name: adminRoleEntry.get('name')}
      ]
    }).exec();
    if (userExists || rolesExist) {
      return HTTP_INTERNAL_SERVER_ERROR(res, 'Admin or Roles already exist');
    }
    try {
      const publicRoleCreated = await publicRoleEntry.save();
      const adminRoleCreated = await adminRoleEntry.save();
      const adminUserCreated = await adminUserEntry.save();
      return HTTP_CREATED(res, {roles: [publicRoleCreated, adminRoleCreated], admin: adminUserCreated});
    } catch (err) {
      return HTTP_INTERNAL_SERVER_ERROR(res, err);
    }
  }
}
