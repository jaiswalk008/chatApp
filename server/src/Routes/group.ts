import {Router} from 'express';
import * as groupController from '../Controllers/group';
const router: Router = Router();
import authenticate from '../middlewares/auth';

router.post('/createGroup',authenticate,groupController.addGroup);
router.get('/getGroups',authenticate,groupController.getGroups);
router.get('/getMembers',groupController.getMembers);
router.delete('/removeuser',groupController.removeUser);
router.patch('/makeAdmin',groupController.makeAdmin);
router.patch('/update-groupname' , groupController.updateGroupName);
export default router;