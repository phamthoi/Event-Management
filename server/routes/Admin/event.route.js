import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { EventController } from "../../controllers/Admin/event.controller.js";

const router = express.Router();

// POST /events - Tạo event mới (chỉ admin)
router.post("/create", authMiddleware, EventController.createEvent);

// GET /events - Lấy danh sách events
router.get("/list", authMiddleware, EventController.getEventsList);

// GET /events/:id - Lấy chi tiết event
router.get("/:id", authMiddleware, EventController.getEventById);


// PUT /events/:id - Cập nhật event (chỉ admin)
router.put("/:id", authMiddleware, EventController.updateEvent);

// DELETE /events/:id - Xóa event (chỉ admin)
router.delete("/:id", authMiddleware, EventController.deleteEvent);

// PUT /events/:id/attendance - Cập nhật attendance (chỉ admin)
router.put("/:id/attendance", authMiddleware, EventController.updateAttendance);

// POST /events/:id/register - Đăng ký tham gia event
// router.post("/:id/register", authMiddleware, EventController.registerEventMember);




export default router;