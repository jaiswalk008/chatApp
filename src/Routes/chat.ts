import {Router} from 'express';
import * as messageController from '../Controllers/chat';
import authenticate from '../middlewares/auth'
const router: Router = Router();

router.get('/getUsers',messageController.getUserList);

router.post('/sendMessage',authenticate,messageController.sendMessage);

router.get('/getMessages',messageController.getMessages);
export default router;