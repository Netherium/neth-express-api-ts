import {Request, Response} from 'express';
import userModel from '../models/user.model';

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
    // console.log('ispasswordvalid', user.validPassword(req.body.password));
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
    role: 'user',
    isVerified: false,
    password: req.body.password
  });

  user.save((err: any, user: any) => {
    console.log(user);
    // console.log(registeredUser);
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
    user.password= req.body.password ? req.body.password: user.password;
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
