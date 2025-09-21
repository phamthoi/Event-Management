// routes/Member/member.route.js
import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as memberController from '../../controllers/Member/member.controller.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication và role MEMBER
router.use(authMiddleware);
router.use(requireRole('MEMBER'));

// Profile routes
router.get('/profile', memberController.getProfile);
router.put('/profile', memberController.updateProfile);
router.put('/profile/password', memberController.changePassword);

// Member list route
router.get('/members', memberController.getMembers);

// Event routes
router.get('/events', memberController.getMyEvents);
router.get('/events/upcoming', memberController.getUpcomingEvents);
router.post('/events/:eventId/register', memberController.registerEvent);
router.delete('/events/:eventId/register', memberController.cancelEventRegistration);

export default router;