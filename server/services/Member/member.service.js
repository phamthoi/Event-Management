// services/Member/member.service.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lấy profile của member
export const getMemberProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        organizationId: true,
        organization: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Cập nhật profile member
export const updateMemberProfile = async (userId, updateData) => {
  try {
    const { fullName, phoneNumber } = updateData;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phoneNumber
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        organizationId: true
      }
    });
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// Đổi mật khẩu
export const changeMemberPassword = async (userId, currentPassword, newPassword) => {
  try {
    // Lấy user hiện tại
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash mật khẩu mới
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Cập nhật mật khẩu
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash
      }
    });
    
    return { message: 'Password updated successfully' };
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách members cùng organization
export const getMembersByOrganization = async (organizationId, page = 1, limit = 10, filters = {}) => {
  try {
    const { email, fullName } = filters;
    const skip = (page - 1) * limit;
    
    const where = {
      organizationId: organizationId,
      role: 'MEMBER',
      isActive: true
    };
    
    // Thêm filters
    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive'
      };
    }
    
    if (fullName) {
      where.fullName = {
        contains: fullName,
        mode: 'insensitive'
      };
    }
    
    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          createdAt: true
        },
        orderBy: {
          fullName: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);
    
    return {
      members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};

// Lấy events mà member đã đăng ký
export const getMemberEvents = async (userId) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: {
        userId: userId,
        status: 'REGISTERED'
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            startAt: true,
            endAt: true,
            registrationEndAt: true,
            maxAttendees: true,
            status: true,
            _count: {
              select: {
                registrations: {
                  where: {
                    status: 'REGISTERED'
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        event: {
          startAt: 'asc'
        }
      }
    });
    
    return registrations.map(reg => ({
      ...reg.event,
      registeredCount: reg.event._count.registrations
    }));
  } catch (error) {
    throw error;
  }
};

// Lấy upcoming events (chưa đăng ký)
export const getUpcomingEvents = async (organizationId, userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const events = await prisma.event.findMany({
      where: {
        organizationId: organizationId,
        status: {
          in: ['REGISTRATION', 'READY']
        },
        startAt: {
          gte: new Date()
        }
      },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: 'REGISTERED'
              }
            }
          }
        },
        registrations: {
          where: {
            userId: userId,
            status: 'REGISTERED'
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        startAt: 'asc'
      },
      skip: skip,
      take: limit
    });
    
    const total = await prisma.event.count({
      where: {
        organizationId: organizationId,
        status: {
          in: ['REGISTRATION', 'READY']
        },
        startAt: {
          gte: new Date()
        }
      }
    });
    
    const eventsWithRegistrationStatus = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startAt: event.startAt,
      endAt: event.endAt,
      registrationEndAt: event.registrationEndAt,
      maxAttendees: event.maxAttendees,
      status: event.status,
      registeredCount: event._count.registrations,
      isRegistered: event.registrations.length > 0
    }));
    
    return {
      events: eventsWithRegistrationStatus,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};

// Đăng ký event
export const registerForEvent = async (userId, eventId) => {
  try {
    // Kiểm tra event có tồn tại và có thể đăng ký không
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: 'REGISTERED'
              }
            }
          }
        }
      }
    });
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (event.status !== 'REGISTRATION') {
      throw new Error('Event registration is not open');
    }
    
    if (event.registrationEndAt && new Date() > event.registrationEndAt) {
      throw new Error('Registration period has ended');
    }
    
    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      throw new Error('Event is full');
    }
    
    // Kiểm tra đã đăng ký chưa
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      }
    });
    
    if (existingRegistration && existingRegistration.status === 'REGISTERED') {
      throw new Error('Already registered for this event');
    }
    
    // Tạo hoặc cập nhật registration
    const registration = await prisma.registration.upsert({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      update: {
        status: 'REGISTERED'
      },
      create: {
        eventId: eventId,
        userId: userId,
        status: 'REGISTERED'
      }
    });
    
    return registration;
  } catch (error) {
    throw error;
  }
};

// Hủy đăng ký event
export const cancelEventRegistration = async (userId, eventId) => {
  try {
    // Kiểm tra registration có tồn tại không
    const registration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      include: {
        event: {
          select: {
            registrationEndAt: true,
            status: true
          }
        }
      }
    });
    
    if (!registration || registration.status !== 'REGISTERED') {
      throw new Error('Registration not found');
    }
    
    // Kiểm tra có thể hủy không (trước thời hạn đăng ký)
    if (registration.event.registrationEndAt && new Date() > registration.event.registrationEndAt) {
      throw new Error('Cannot cancel registration after registration deadline');
    }
    
    // Cập nhật status thành CANCELLED
    const updatedRegistration = await prisma.registration.update({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId
        }
      },
      data: {
        status: 'CANCELLED'
      }
    });
    
    return updatedRegistration;
  } catch (error) {
    throw error;
  }
};