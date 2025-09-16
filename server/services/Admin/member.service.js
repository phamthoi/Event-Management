import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class MemberService {
  // Member profile methods
  static async getProfileMember(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, phoneNumber: true, role: true, organizationId: true }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  static async updateProfileMember(userId, data) {
    const { fullName, phoneNumber } = data;
    
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { fullName, phoneNumber },
      select: { id: true, fullName: true, email: true, phoneNumber: true }
    });
    
    return updated;
  }

  static async changePasswordMember(userId, currentPassword, newPassword) {
    // Get user from db
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Check current password
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in db
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });
  }

  static async registerEventMember(userId, eventId) {
    // TODO: Implement event registration logic
    // This would typically create an EventRegistration record
    throw new Error("Event registration not implemented yet");
  }






  // Admin methods
  static async getMembersList(filters) {
    const { email, fullName, isActive, page = 1, limit = 10, organizationId } = filters;
    const where = { organizationId, role: "MEMBER" };

    if (email) where.email = { contains: email, mode: "insensitive" };
    if (fullName) where.fullName = { contains: fullName, mode: "insensitive" };
    if (isActive !== undefined) where.isActive = isActive === "true";

    const members = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true
      }
    });

    const total = await prisma.user.count({ where });

    return {
      members,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  static async createMember(memberData) {
    const { fullName, email, password, organizationId } = memberData;

    // Kiểm tra email trùng
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new Error("Email đã tồn tại");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const member = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "MEMBER",
        isActive: true,
        organizationId,
      },
    });

    return member;
  }

  static async lockMember(memberId) {
    const member = await prisma.user.update({
      where: { id: memberId },
      data: { isActive: false },
    });

    return member;
  }

  static async unlockMember(memberId) {
    const member = await prisma.user.update({
      where: { id: memberId },
      data: { isActive: true },
    });

    return member;
  }

  static async resetPassword(memberId) {
    const newPassword = "Member@123";
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: memberId },
      data: { passwordHash },
    });
  }
}