// services/Admin/profile.service.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lấy profile của admin
export const getAdminProfile = async (userId) => {
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
        isActive: true,
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

// Cập nhật profile admin
export const updateAdminProfile = async (userId, updateData) => {
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
        organizationId: true,
        isActive: true,
        organization: {
          select: {
            name: true
          }
        }
      }
    });
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// Đổi mật khẩu admin
export const changeAdminPassword = async (userId, currentPassword, newPassword) => {
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