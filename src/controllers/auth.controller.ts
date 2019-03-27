import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { Role } from '../models/role.enum';
/**
 * authController.ts
 * @description :: Server-side logic for managing users.
 */

/**
 * authController.login()
 */
export let login = (req: Request, res: Response) => {
  userModel.findOne({email: req.body.email}, function (err, user: any) {
    if (err) {
      return res.status(500).json({message: 'Error when getting user.'});
    }
    if (!user || !req.body.password || !user.validPassword(req.body.password)) {
      return res.status(401).json({message: 'Wrong credentials.'});
    }
    return res.json({"token": user.generateJWT()});
  });
};

/**
 * authController.profile()
 */
export let profile = (req: Request, res: Response) => {
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
 * authController.register()
 */
export let register = (req: Request, res: Response) => {
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
 * authController.update()
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
    user.password = req.body.password ? req.body.password : user.password;
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
 * authController.remove()
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

/**
 * authController.createAdmin()
 * Creates the first admin based on .env configuration
 */
export let createAdmin = (req: Request, res: Response) => {
  userModel.findOne({role: Role.ADMIN}, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({
        message: 'Error when getting an admin',
        error: err
      });
    }

    if (user) {
      return res.status(404).json({
        message: 'Admin User Exists'
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
            message: 'Error when Admin user',
            error: err
          });
        }
        return res.status(201).json({"token": user.generateJWT(user)});
      });
    }
  });
};
