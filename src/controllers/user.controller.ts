import { Request, Response, Router } from 'express';
import userModel from '../models/user.model';

/**
 * userController.ts
 * @description :: Server-side logic for managing users.
 */
export class UserController {
  public router = Router();

  constructor() {
    this.router.get('/', this.list);
    this.router.get('/:id', this.show);
    this.router.post('/', this.create);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.remove);
  }

  /**
   * userController.list()
   */
  private list = (req: Request, res: Response) => {
    userModel.find((err: any, users: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err
        });
      }
      return res.json(users);
    });
  };

  /**
   * userController.show()
   */
  private show = (req: Request, res: Response) => {
    const id = req.params.id;
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
   * userController.create()
   */
  private create = (req: Request, res: Response) => {
    const user = new userModel({
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      isVerified: req.body.isVerified,
      password: req.body.password
    });

    user.save((err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating user',
          error: err
        });
      }
      return res.status(201).json(user);
    });
  };

  /**
   * userController.update()
   */
  private update = (req: Request, res: Response) => {
    const id = req.params.id;
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
      user.email = req.body.email ? req.body.email : user.email;
      user.name = req.body.name ? req.body.name : user.name;
      user.role = req.body.role ? req.body.role : user.role;
      user.isVerified = req.body.isVerified ? req.body.isVerified : user.isVerified;
      if (req.body.password) {
        user.password = req.body.password;
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
   * userController.remove()
   */
  private remove = (req: Request, res: Response) => {
    const id = req.params.id;
    userModel.findByIdAndDelete(id, (err: any, user: any) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the user.',
          error: err
        });
      }
      return res.status(204).json();
    });
  };
}