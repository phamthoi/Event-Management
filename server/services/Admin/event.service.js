import { PrismaClient } from "@prisma/client";
import { calculateEventStatus } from "../../utils/eventStatus.js";

const prisma = new PrismaClient();

export class EventService {
  // ================= CREATE EVENT =================
  static async createEvent(eventData) {
    const {
      title,
      description,
      location,
      minAttendees,
      maxAttendees,
      startAt,
      endAt,
      deposit,
      status,
      registrationStartAt,
      registrationEndAt,
      organizationId,
      createdById,
    } = eventData;

    // ✅ Tính status realtime ngay khi tạo, attendees rỗng
    const correctStatus = calculateEventStatus({
      initialStatus: status,
      registrationStartAt,
      registrationEndAt,
      startAt,
      endAt,
      minAttendees,
      attendees: [], // tạo event mới chưa có đăng ký
    });

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        minAttendees,
        maxAttendees,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        registrationStartAt: registrationStartAt
          ? new Date(registrationStartAt)
          : null,
        registrationEndAt: registrationEndAt
          ? new Date(registrationEndAt)
          : null,
        deposit: deposit,
        status: correctStatus,
        organizationId,
        createdById,
      },
      include: {
        organization: true,
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return event;
  }

  // ================= GET EVENTS LIST =================
  static async getEventsList(filters) {
    const {
      name,
      location,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      createdById,
      organizationId,
    } = filters;

    const where = {};

    if (createdById) where.createdById = createdById;
    if (organizationId) where.organizationId = organizationId;
    if (name) where.title = { contains: name, mode: "insensitive" };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (startDate || endDate) where.startAt = {};
    if (startDate) where.startAt.gte = new Date(startDate);
    if (endDate) where.startAt.lte = new Date(endDate);

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: { registrations: true }, // để check minAttendees
    });

    // ✅ Tính lại status realtime và update DB nếu khác
    const eventsWithStatus = await Promise.all(
      events.map(async (ev) => {
        const correctStatus = calculateEventStatus({
          initialStatus: ev.status,
          registrationStartAt: ev.registrationStartAt,
          registrationEndAt: ev.registrationEndAt,
          startAt: ev.startAt,
          endAt: ev.endAt,
          minAttendees: ev.minAttendees,
          attendees: ev.registrations,
        });

        // ✅ Cập nhật DB nếu status thay đổi
        if (ev.status !== correctStatus) {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: correctStatus },
          });
        }

        return { ...ev, status: correctStatus };
      })
    );

    const total = await prisma.event.count({ where });

    // ✅ Lọc theo status realtime sau khi tính lại
    const filteredEvents = status
      ? eventsWithStatus.filter((ev) => ev.status === status)
      : eventsWithStatus;

    return {
      events: filteredEvents,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  // ================= GET EVENT BY ID =================
  static async getEventById(eventId) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true }, // để check minAttendees
    });

    if (!event) return null;

    // ✅ Tính lại status realtime và update DB nếu khác
    const correctStatus = calculateEventStatus({
      initialStatus: event.status,
      registrationStartAt: event.registrationStartAt,
      registrationEndAt: event.registrationEndAt,
      startAt: event.startAt,
      endAt: event.endAt,
      minAttendees: event.minAttendees,
      attendees: event.registrations,
    });

    if (event.status !== correctStatus) {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: correctStatus },
      });
    }

    return { ...event, status: correctStatus };
  }

  // ================= UPDATE EVENT =================
  static async updateEvent(eventId, updateData) {
    const {
      title,
      description,
      location,
      minAttendees,
      maxAttendees,
      startAt,
      endAt,
      registrationStartAt,
      registrationEndAt,
      deposit,
      status,
    } = updateData;

    // ✅ Lấy registrations hiện tại
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    });

    const correctStatus = calculateEventStatus({
      initialStatus: status,
      registrationStartAt,
      registrationEndAt,
      startAt,
      endAt,
      minAttendees,
      attendees: existingEvent.registrations,
    });

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location,
        minAttendees,
        maxAttendees,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        registrationStartAt: registrationStartAt
          ? new Date(registrationStartAt)
          : null,
        registrationEndAt: registrationEndAt
          ? new Date(registrationEndAt)
          : null,
        deposit: deposit ? parseFloat(deposit) : 0,
        status: correctStatus,
      },
      include: {
        organization: true,
        createdBy: { select: { id: true, fullName: true, email: true } },
      },
    });

    return event;
  }

  // ================= DELETE EVENT =================
  static async deleteEvent(eventId) {
    await prisma.event.delete({ where: { id: eventId } });
  }

  // ================= GET EVENT REGISTRATIONS =================
  static async getEventRegistrations(eventId) {
    try {
      const registrations = await prisma.registration.findMany({
        where: { eventId },
        include: { user: { select: { id: true, fullName: true, email: true } } },
      });

      return registrations;
    } catch (error) {
      throw error;
    }
  }

  // ================= UPDATE ATTENDANCE =================
  static async updateAttendance(updates) {
    await Promise.all(
      updates.map((u) =>
        prisma.registration.update({
          where: { id: parseInt(u.registrationId) },
          data: { attendance: u.attended },
        })
      )
    );
  }
}
