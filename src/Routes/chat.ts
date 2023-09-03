import {Router} from 'express';
import * as messageController from '../Controllers/chat';
import authenticate from '../middlewares/auth'
const router: Router = Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({storage});

router.get('/getUsers',messageController.getUserList);

router.post('/sendMessage',authenticate,messageController.sendMessage);

router.get('/getMessages',messageController.getMessages);
router.post('/sendFile',authenticate,uploads.array("file"),messageController.sendFile);
export default router;