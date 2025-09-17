import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventService {
  // Gộp chức năng updateEventStatus vào trong class
  static async updateEventStatus() {
    const now = new Date();

    try {

      // 0️⃣ DRAFT -> ONGOING (for events created during event time)
      const draftEventsInProgress = await prisma.event.findMany({
        where: {
          status: "DRAFT",
          startAt: { lte: now },
          endAt: { gt: now },
        },
        include: { registrations: true },
      });

      for (const ev of draftEventsInProgress) {
        const registered = ev.registrations.length;
        if (registered >= (ev.minAttendees || 1)) {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: "ONGOING" },
          });
          console.log(`🚀 Event ${ev.id} moved DRAFT -> ONGOING (created during event time)`);
        } else {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: "CANCELLED" },
          });
          console.log(`❌ Event ${ev.id} DRAFT -> CANCELLED (insufficient attendees during event time)`);
        }
      }

      // 1️⃣ DRAFT -> REGISTRATION
      const draftEvents = await prisma.event.findMany({
        where: {
          status: "DRAFT",
          registrationStartAt: { lte: now },
          registrationEndAt: { gt: now },
        },
      });

      for (const ev of draftEvents) {
        await prisma.event.update({
          where: { id: ev.id },
          data: { status: "REGISTRATION" },
        });
        console.log(`📌 Event ${ev.id} moved DRAFT -> REGISTRATION`);
      }

      // 2️⃣ REGISTRATION -> READY | CANCELLED
      const regEvents = await prisma.event.findMany({
        where: {
          status: "REGISTRATION",
          registrationEndAt: { lte: now },
        },
        include: { registrations: true },
      });

      for (const ev of regEvents) {
        const registered = ev.registrations.length;
        if (registered >= (ev.minAttendees || 1)) {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: "READY" },
          });
          console.log(`✅ Event ${ev.id} REGISTRATION -> READY`);
        } else {
          await prisma.event.update({
            where: { id: ev.id },
            data: { status: "CANCELLED" },
          });
          console.log(`❌ Event ${ev.id} REGISTRATION -> CANCELLED`);
        }
      }

      // 2.5️⃣ DRAFT -> READY (for events that are 1 day before start and registration has ended)
      const oneDayBeforeEvents = await prisma.event.findMany({
        where: {
          status: "DRAFT",
          registrationEndAt: { lt: now },
          startAt: { gt: now },
        },
        include: { registrations: true },
      });

      for (const ev of oneDayBeforeEvents) {
        const eventStart = new Date(ev.startAt);
        const oneDayBefore = new Date(eventStart);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        
        if (now >= oneDayBefore) {
          const registered = ev.registrations.length;
          if (registered >= (ev.minAttendees || 1)) {
            await prisma.event.update({
              where: { id: ev.id },
              data: { status: "READY" },
            });
            console.log(`✅ Event ${ev.id} DRAFT -> READY (1 day before)`);
          } else {
            await prisma.event.update({
              where: { id: ev.id },
              data: { status: "CANCELLED" },
            });
            console.log(`❌ Event ${ev.id} DRAFT -> CANCELLED (insufficient attendees)`);
          }
        }
      }

      // 3️⃣ READY -> ONGOING
      await prisma.event.updateMany({
        where: { status: "READY", startAt: { lte: now } },
        data: { status: "ONGOING" },
      });

      // 4️⃣ ONGOING -> COMPLETED
      await prisma.event.updateMany({
        where: { status: "ONGOING", endAt: { lte: now } },
        data: { status: "COMPLETED" },
      });

    } catch (err) {
      console.error("❌ Error updating event statuses:", err);
    }
  }

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
      createdById
    } = eventData;

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
        deposit: deposit,
        status: status,
        organizationId,
        createdById
      },
    });

    // Cập nhật status ngay sau khi tạo event - sử dụng method trong class
    await this.updateEventStatus();
    
    // Lấy lại event với status đã được cập nhật
    const updatedEvent = await prisma.event.findUnique({
      where: { id: event.id }
    });

    return updatedEvent;
  }

  static async getEventsList(filters) {
    await this.updateEventStatus(); // Cập nhật trạng thái event trước khi lấy danh sách

    const { name, location, status, startDate, endDate, page = 1, limit = 10, createdById } = filters;

    const where = {};
    
    // Chỉ filter theo createdById khi nó được cung cấp
    if (createdById) {
      where.createdById = createdById;
    }

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
        deposit: true,
      },
    });

    const total = await prisma.event.count({ where });

    return {
      events,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  static async getEventById(eventId) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    return event;
  }

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
        registrationStartAt: registrationStartAt ? new Date(registrationStartAt) : null,
        registrationEndAt: registrationEndAt ? new Date(registrationEndAt) : null,
        deposit: deposit ? parseFloat(deposit) : 0,
        status: status,
      }
    });

    // Cập nhật status ngay sau khi update event - sử dụng method trong class
    await this.updateEventStatus();
    
    // Lấy lại event với status đã được cập nhật
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId }
    });

    return updatedEvent;
  }

  static async deleteEvent(eventId) {
    await prisma.event.delete({ where: { id: eventId } });
  }

  static async getEventRegistrations(eventId) {
    
    try {
      const registrations = await prisma.registration.findMany({
        where: { eventId },
        include: { 
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
      });
    
      return registrations;
    } catch (error) {
     
      throw error;
    }
  }

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