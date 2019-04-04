import { Request, Response, Router } from 'express';
import { Auth } from "../middleware/auth";
import userModel from '../models/user.model';
import { Role } from '../models/role.enum';

/**
 * auth.controller.ts
 * @description :: Server-side logic for managing users.
 */
export class AuthController {
  public router = Router();

  constructor() {
    this.router.post('/login', this.getToken);
    this.router.get('/profile', Auth.isAuthenticated(), this.show);
    this.router.post('/register', this.create);
    this.router.put('/profile', Auth.isAuthenticated(), this.update);
    this.router.delete('/profile', Auth.isAuthenticated(), this.remove);
    this.router.post('/createadmin', this.createAdmin);
  }

  /**
   * AuthController.login()
   */
  private getToken = (req: Request, res: Response) => {
    userModel.findOne({email: req.body.email}, function (err, user: any) {
      if (err) {
        return res.status(500).json({message: 'Error when getting user.'});
      }
      if (!user || !req.body.password || !user.validPassword(req.body.password)) {
        return res.status(401).json({message: 'Wrong credentials.'});
      }
      return res.status(201).json({"token": user.generateJWT()});
    });
  };

  /**
   * AuthController.profile()
   */
  private show = (req: Request, res: Response) => {
    const id = res.locals.authUser;
    userModel.findOne({_id: id}, (err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }
      return res.json(user);
    });
  };

  /**
   * AuthController.register()
   */
  private create = (req: Request, res: Response) => {
    const user = new userModel({
      email: req.body.email,
      name: req.body.name,
      role: Role.USER,
      isVerified: false,
      password: req.body.password
    });

    user.save((err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating user',
          error: err
        });
      }
      return res.status(201).json({"token": user.generateJWT(user)});
    });
  };

  /**
   * AuthController.update()
   */
  private update = (req: Request, res: Response) => {
    const id = res.locals.authUser;
    userModel.findOne({_id: id}, (err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }
      user.name = req.body.name ? req.body.name : user.name;
      if (req.body.password) {
        user.password = req.body.password
      }
      user.save((err: any, user: any) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating user.',
            error: err
          });
        }
        return res.json(user);
      });
    });
  };

  /**
   * AuthController.remove()
   */
  private remove = (req: Request, res: Response) => {
    const id = res.locals.authUser;
    userModel.findByIdAndDelete(id, (err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }
      return res.status(204).json();
    });
  };

  /**
   * AuthController.createAdmin()
   * Creates the first admin based on .env configuration
   */
  private createAdmin = (req: Request, res: Response) => {
    userModel.findOne({role: Role.ADMIN}, (err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting an admin',
          error: err
        });
      }
      if (user) {
        return res.status(500).json({
          message: 'Admin already exists'
        });
      } else {
        const user = new userModel({
          email: process.env.ADMIN_EMAIL,
          name: process.env.ADMIN_NAME,
          role: Role.ADMIN,
          isVerified: true,
          password: process.env.ADMIN_PASSWORD,
        });

        user.save((err: any, user: any) => {
          if (err) {
            return res.status(500).json({
              message: 'Error when saving admin',
              error: err
            });
          }
          return res.status(201).json({"token": user.generateJWT(user)});
        });
      }
    });
  }
}
