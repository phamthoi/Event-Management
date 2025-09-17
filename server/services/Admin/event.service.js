import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EventService {
  static calculateEventStatus({
    initialStatus,
    registrationStartAt,
    registrationEndAt,
    startAt,
    endAt,
  }) {
    const now = new Date();

    if (registrationStartAt && now < new Date(registrationStartAt)) {
      return "DRAFT";
    }

    if (
      registrationStartAt &&
      registrationEndAt &&
      now >= new Date(registrationStartAt) &&
      now <= new Date(registrationEndAt)
    ) {
      return "REGISTRATION";
    }

    if (
      registrationEndAt &&
      startAt &&
      now > new Date(registrationEndAt) &&
      now < new Date(startAt)
    ) {
      return "READY";
    }

    if (
      startAt &&
      endAt &&
      now >= new Date(startAt) &&
      now <= new Date(endAt)
    ) {
      return "ONGOING";
    }

    if (endAt && now > new Date(endAt)) {
      return "COMPLETED";
    }

    return initialStatus || "DRAFT";
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
      createdById,
    } = eventData;
  
    const correctStatus = this.calculateEventStatus({
      initialStatus: status,  
      registrationStartAt,
      registrationEndAt,
      startAt,
      endAt,
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
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  
    return event;
  }

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
    } = filters;
  
    const where = {};
  
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
      limit: parseInt(limit),
    };
  }

  static async getEventById(eventId) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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

    const correctStatus = this.calculateEventStatus({
      initialStatus: status,
      registrationStartAt,
      registrationEndAt,
      startAt,
      endAt,
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
        createdBy: {
          select: {
            id: true,
            fullName: true,  
            email: true
          }
        }
      }
    });
  
    return event;
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
              email: true,
            },
          },
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
