import express from "express";
import { PrismaClient } from "@prisma/client";
import { updateEventStatus } from "../utils/eventStatusUpdater.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /admin/events/create
router.post("/create", authMiddleware, async (req, res) => {
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
router.get("/list", authMiddleware, async (req, res) => {
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
      orderBy: { createdAt: "desc" },
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

//GET /admin/events/:id
router.get("/:id", authMiddleware, async (req, res) => {
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


// PUT /admin/events/:id
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
router.delete("/:id", authMiddleware, async (req, res) => {
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
router.get("/:eventId/registrations", authMiddleware, async (req, res) => {
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

export default router;