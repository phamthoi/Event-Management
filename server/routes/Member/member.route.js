// routes/Member/member.route.js
import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as memberController from '../../controllers/Member/member.controller.js';

const router = express.Router();


router.use(authMiddleware);
router.use(requireRole('MEMBER'));


router.get('/profile', memberController.getProfile);
router.put('/profile', memberController.updateProfile);
router.put('/profile/password', memberController.changePassword);


router.get('/members', memberController.getMembers);


// router.get('/events', memberController.getMyEvents);
// router.get('/events/upcoming', memberController.getUpcomingEvents);
// router.post('/events/:eventId/register', memberController.registerEvent);
// router.delete('/events/:eventId/register', memberController.cancelEventRegistration);
router.get('/events', authMiddleware, requireRole(['ADMIN', 'MEMBER']), memberController.getMyEvents);
router.get('/events/upcoming', authMiddleware, requireRole(['ADMIN', 'MEMBER']), memberController.getUpcomingEvents);
router.post('/events/:eventId/register', authMiddleware, requireRole(['ADMIN', 'MEMBER']), memberController.registerEvent);
router.delete('/events/:eventId/register', authMiddleware, requireRole(['ADMIN', 'MEMBER']), memberController.cancelEventRegistration);

export default router;