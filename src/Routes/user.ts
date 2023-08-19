import {Router} from 'express';
import * as userController from '../Controllers/userController';
const router: Router = Router();

router.post('/signup',userController.addUser);

router.post('/login',userController.login);
export default router;
