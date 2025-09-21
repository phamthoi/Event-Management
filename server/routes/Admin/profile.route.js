// routes/Admin/profile.route.js
import express from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import * as profileController from '../../controllers/Admin/profile.controller.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication và role ADMIN
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

// Profile routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.changePassword);

export default router;