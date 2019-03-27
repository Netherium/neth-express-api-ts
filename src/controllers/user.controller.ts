import {Request, Response} from 'express';
import userModel from '../models/user.model';
/**
 * userController.ts
 * @description :: Server-side logic for managing users.
 */

/**
 * userController.list()
 */
export let list = (req: Request, res: Response) => {
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
export let show = (req: Request, res: Response) => {
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
export let create = (req: Request, res: Response) => {
  const user = new userModel({
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
    isVerified: req.body.isVerified,
    salt: req.body.salt,
    hash: req.body.hash
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
export let update = (req: Request, res: Response) => {
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
    user.salt = req.body.salt ? req.body.salt : user.salt;
    user.hash = req.body.hash ? req.body.hash : user.hash;
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
export let remove = (req: Request, res: Response) => {
  const id = req.params.id;
  userModel.findByIdAndRemove(id, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({
        message: 'Error when deleting the user.',
        error: err
      });
    }
    return res.status(204).json();
  });
};
