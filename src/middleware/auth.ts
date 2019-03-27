import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import userModel from '../models/user.model';
import {Role} from '../models/role.enum';

export default class Auth {
  static isAuthenticated(title: Role) {
    return (req: Request, res: Response, next: NextFunction) =>{
      console.log(title);
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.secret, function (err, decoded) {
          if (err) {
            return res.status(403).json({message: 'Failed to authenticate token.'});
          } else {
            res.locals.authUser = decoded;
            console.log('authUser', res.locals.authUser);
            next();
          }
        });
      } else {
        return res.status(403).json({message: 'Failed to authenticate token.'});
      }
    }
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      let token = req.headers.authorization.split(' ')[1];
      if (token) {
        jwt.verify(token, process.env.secret, function (err, decoded: any) {
          if (err) {
            return res.status(403).json({message: 'Failed to authenticate token.'});
          } else {
            userModel.findOne({_id: decoded._id}, function (err, user: any) {
              if (err) {
                return res.status(500).json({message: 'Failed to authenticate token.'});
              }
              if (!user || user.role !== 'admin') {
                return res.status(401).json({message: 'Unauthorized.'});
              }
              res.locals.authUser = decoded;
              next();
            });
          }
        });
      }
    } else {
      return res.status(403).json({message: 'Failed to authenticate token.'});
    }
  };
}
// export let isAuthenticated = function (req: Request, res: Response, next: NextFunction) {
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     let token = req.headers.authorization.split(' ')[1];
//     jwt.verify(token, process.env.secret, function (err, decoded) {
//       if (err) {
//         return res.status(403).json({message: 'Failed to authenticate token.'});
//       } else {
//         res.locals.authUser = decoded;
//         console.log('authUser', res.locals.authUser);
//         next();
//       }
//     });
//
//   } else {
//     return res.status(403).json({message: 'Failed to authenticate token.'});
//   }
// };
//
// export let isAdmin = function (req: Request, res: Response, next: NextFunction) {
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     let token = req.headers.authorization.split(' ')[1];
//     if (token) {
//       jwt.verify(token, process.env.secret, function (err, decoded: any) {
//         if (err) {
//           return res.status(403).json({message: 'Failed to authenticate token.'});
//         } else {
//           userModel.findOne({_id: decoded._id}, function (err, user: any) {
//             if (err) {
//               return res.status(500).json({message: 'Failed to authenticate token.'});
//             }
//             if (!user || user.role !== 'admin') {
//               return res.status(401).json({message: 'Unauthorized.'});
//             }
//             res.locals.authUser = decoded;
//             next();
//           });
//         }
//       });
//     }
//   } else {
//     return res.status(403).json({message: 'Failed to authenticate token.'});
//   }
// };
