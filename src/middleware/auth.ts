import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Role } from '../models/role.enum';

export class Auth {
  static isAuthenticated() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.secret, function (err, decoded) {
          if (err) {
            return res.status(403).json({message: 'Failed to authenticate token.'});
          } else {
            res.locals.authUser = decoded;
            next();
          }
        });
      } else {
        return res.status(403).json({message: 'Failed to authenticate token.'});
      }
    }
  }

  static hasRole(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.secret, function (err, decoded) {
          if (err) {
            return res.status(403).json({message: 'Failed to authenticate token.'});
          } else {
            res.locals.authUser = decoded;
            if (roles.indexOf(res.locals.authUser.role) === -1) {
              return res.status(401).json({message: 'Unauthorized.'});
            }
            else {
              next();
            }
          }
        });
      } else {
        return res.status(403).json({message: 'Failed to authenticate token.'});
      }
    }
  };
}