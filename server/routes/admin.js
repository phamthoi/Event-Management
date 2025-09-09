// routes/admin.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { updateEventStatus } from "../utils/eventStatusUpdater.js";
import { authMiddleware, requireRole } from "../middleware/auth.js"; // ✅ middleware kiểm tra token JWT

const router = express.Router();
const prisma = new PrismaClient();

// ------------------------
// ✅ MEMBER ROUTES
// ------------------------

// GET /admin/members/list - lấy danh sách member với filter + phân trang
router.get("/members/list", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const { email, fullName, isActive, page = 1, limit = 10 } = req.query;
    const where = { organizationId: req.user.organizationId, role: "MEMBER" };

    if (email) where.email = { contains: email, mode: "insensitive" };
    if (fullName) where.fullName = { contains: fullName, mode: "insensitive" };
    if (isActive !== undefined) where.isActive = isActive === "true";

    const members = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select:{
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true
      }
    });

    const total = await prisma.user.count({ where });

    res.json({ members, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/members - tạo member mới
router.post("/members/create", authMiddleware, async (req, res) => {
  console.log("req.user:", req.user);
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Chỉ admin mới tạo member" });

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  
  try {
    // 📌 check email trùng
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

    const passwordHash = await bcrypt.hash(password, 10);

    const member = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "MEMBER",
        isActive: true,
        organizationId: req.user.organizationId, // ✅ ép theo tổ chức của admin
      },
    });
    res.json({success: true, member});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /admin/members/:id/lock - khóa member
router.post("/members/:id/lock", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const member = await prisma.user.update({
      where: { id: parseInt(req.params.id) }, // ✅ convert id
      data: { isActive: false },
    });

    res.json({ message: "Member đã bị khóa", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/members/:id/unlock - mở khóa member
router.post("/members/:id/unlock", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const member = await prisma.user.update({
      where: { id: parseInt(req.params.id) }, // ✅ convert id
      data: { isActive: true },
    });

    res.json({ message: "Member đã được mở khóa", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/members/:id/reset-password - reset password về mặc định
router.post("/members/:id/reset-password", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới reset password" });

    const newPassword = "Member@123";
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: parseInt(req.params.id) }, // ✅ convert id
      data: { passwordHash },
    });

    res.json({ message: "Password đã reset về 'Member@123'" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// ✅ EVENT ROUTES
// ------------------------

// POST /admin/events - tạo event mới
router.post("/events/create", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Chỉ admin mới tạo event" });

  try {
    const {
      title,
      description,
      location,
      minAttendees,
      maxAttendees,
      startAt,
      endAt,
      deposit,
      registrationStartAt,
      registrationEndAt,
      organizationId,
    } = req.body;

    // Kiểm tra token đã decode id chưa
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Invalid token: user not found" });
    }

    //tạo event 
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        minAttendees,
        maxAttendees,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        registrationStartAt: registrationStartAt ? new Date(registrationStartAt) : null,
        registrationEndAt: registrationEndAt ? new Date(registrationEndAt) : null,
        deposit: deposit, // ✅ thêm deposit
        status: "DRAFT", // Mặc định là DRAFT
        organizationId: req.user.organizationId, // ✅ ép theo tổ chức admin
        createdById: req.user.id // gán admin tạo event
      },
    });

    res.json({ success: true, event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /admin/events/list - lọc danh sách event + phân trang
router.get("/events/list", authMiddleware, async (req, res) => {
  try {
    await updateEventStatus(); // Cập nhật trạng thái event trước khi lấy danh sách
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const { name, location, status, startDate, endDate, page = 1, limit = 10 } =
      req.query;

    const where = { createdById: req.user.id };

    if (name) where.title = { contains: name, mode: "insensitive" };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (status) where.status = status;
    if (startDate || endDate) where.startAt = {};
    if (startDate) where.startAt.gte = new Date(startDate);
    if (endDate) where.startAt.lte = new Date(endDate);

    const events = await prisma.event.findMany({
      where,
      orderBy: { startAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        location: true,
        startAt: true,
        endAt: true,
        status: true,
        deposit: true, // ✅ thêm deposit
      },
    });

    const total = await prisma.event.count({ where });

    res.json({ events, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/events/:id - chi tiết event
router.get("/events/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới truy cập" });

    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!event) return res.status(404).json({ message: "Event không tồn tại" });

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /admin/events/:id - update event
router.put("/edit-event/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Chỉ admin mới update event" });

  const { id } = req.params;
  const { title, description, location, minAttendees, maxAttendees, startAt, endAt, registrationStartAt, registrationEndAt, deposit } = req.body;

  try {
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        location,
        minAttendees,
        maxAttendees,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        registrationStartAt: registrationStartAt ? new Date(registrationStartAt) : null,
        registrationEndAt: registrationEndAt ? new Date(registrationEndAt) : null,
        deposit: deposit ? parseFloat(deposit) : 0
      }
    });

    res.json({ success: true, event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// DELETE /admin/events/:id
router.delete("/events/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Chỉ admin mới xóa event" });

  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// GET /admin/events/:eventId/registrations - danh sách đăng ký event
router.get("/events/:eventId/registrations", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await prisma.registration.findMany({
      where: { eventId: parseInt(eventId) }, // ✅ convert id
      include: { user: true },
    });

    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PUT /admin/registrations/attendance - cập nhật điểm danh
router.put("/registrations/attendance", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Chỉ admin mới cập nhật attendance" });

    const { updates } = req.body;

    await Promise.all(
      updates.map((u) =>
        prisma.registration.update({
          where: { id: parseInt(u.id) }, // ✅ convert id
          data: { attended: u.attended },
        })
      )
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------------
// ✅ DASHBOARD
// ------------------------


/**
 * POST /admin/notifications/send
 * Admin gửi thông báo cho member
 */
router.post("/notifications/send", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới có quyền gửi thông báo" });
  }

  const { recipientId, title, message, type } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: "Thiếu tiêu đề hoặc nội dung thông báo" });
  }

  try {
    // Nếu có recipientId -> gửi cho 1 member
    // Nếu không có recipientId -> gửi cho toàn bộ member
    let notifications = [];

    if (recipientId) {
      const notification = await prisma.notification.create({
        data: {
          title,
          message,
          type: type || "GENERAL",
          recipientId: parseInt(recipientId),
        },
      });
      notifications.push(notification);
    } else {
      // Gửi cho toàn bộ member trong hệ thống
      const members = await prisma.user.findMany({
        where: { role: "MEMBER", isActive: true },
        select: { id: true },
      });

      notifications = await Promise.all(
        members.map((member) =>
          prisma.notification.create({
            data: {
              title,
              message,
              type: type || "GENERAL",
              recipientId: member.id,
            },
          })
        )
      );
    }

    res.json({
      success: true,
      message: "Thông báo đã được gửi",
      count: notifications.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ API verify token & trả về thông tin user
router.get("/dashboard", authMiddleware, requireRole("ADMIN"), async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user // user đã được decode từ token trong middleware
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
