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
  private list(req: Request, res: Response): Promise<Response> {
    return userModel.find()
      .then((users) => res.json(users))
      .catch((err) =>
        res.status(500).json({
            message: 'Error when getting user.',
            error: err
          }
        ));
  }

  /**
   * userController.show()
   */
  private show(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    return userModel.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'No such user'
          });
        }
        return res.json(user);
      })
      .catch((err) => res.status(500).json({
        message: 'Error when getting user.',
        error: err
      }));
  }

  /**
   * userController.create()
   */
  private create(req: Request, res: Response): Promise<Response> {
    const user = new userModel({
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      isVerified: req.body.isVerified,
      password: req.body.password
    });
    return userModel.create(user)
      .then((newUser) => res.status(201).json(newUser))
      .catch((err) => res.status(500).json({
        message: 'Error when creating user',
        error: err
      }));
  }

  /**
   * userController.update()
   */
  private update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    return userModel.findById(id)
      .then((user: any) => {
        if (!user) {
          return res.status(404).json({
            message: 'No such user'
          });
        } else {
          user.email = req.body.email ? req.body.email : user.email;
          user.name = req.body.name ? req.body.name : user.name;
          user.role = req.body.role ? req.body.role : user.role;
          user.isVerified = req.body.isVerified ? req.body.isVerified : user.isVerified;
          if (req.body.password) {
            user.password = req.body.password;
          }
          return user.save()
            .then((newUser: any) => {
              return res.json(newUser);
            })
            .catch((newErr: any) => res.status(500).json({
              message: 'Error when updating user.',
              error: newErr
            }));
        }
      })
      .catch((err) => res.status(500).json({
        message: 'Error when getting user.',
        error: err
      }));
  }

  /**
   * userController.remove()
   */
  private remove(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    return userModel.findByIdAndDelete(id)
      .then((newUser) => {
          if (!newUser) {
            return res.status(404).json({
              message: 'No such user'
            });
          }
          return res.status(204).json();
        }
      )
      .catch((err) => res.status(500).json({
          message: 'Error when deleting user.',
          error: err
        })
      );
  }
}
