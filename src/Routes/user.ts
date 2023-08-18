import {Router} from 'express';
import * as userController from '../Controllers/userController';
const router: Router = Router();

router.post('/',userController.addUser);

export default router;
