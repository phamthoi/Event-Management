import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as memberController from '../../controllers/member/member.controller.js';

const router = express.Router();


router.use(authMiddleware);
router.use(requireRole('MEMBER'));


router.get('/members', memberController.getMembers);




export default router;