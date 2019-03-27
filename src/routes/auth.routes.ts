import * as express from 'express';
import * as authController from '../controllers/auth.controller';
import Auth from "../middleware/auth";
import {Role} from '../models/role.enum';
const router = express.Router();

/*
 * POST
 */
router.post('/login', authController.login);

//TODO protect route
/*
 * GET
 */
router.get('/profile', Auth.isAuthenticated(Role.USER), authController.profile);

/*
 * POST
 */
router.post('/register', authController.register);

//TODO protect route
/*
 * PUT
 */
// router.put('/profile', authController.update);

export default router;
