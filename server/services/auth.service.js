import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthService {
  static async loginAdmin(email, password) {
    try {
      // Tìm user theo email
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user) {
        return {
          success: false,
          message: "Email không tồn tại"
        };
      }

      // Kiểm tra role admin
      if (user.role !== "ADMIN") {
        return {
          success: false,
          message: "Chỉ admin mới được đăng nhập"
        };
      }

      // Kiểm tra account có bị khóa không
      if (!user.isActive) {
        return {
          success: false,
          message: "Tài khoản đã bị khóa"
        };
      }

      // Kiểm tra password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return {
          success: false,
          message: "Mật khẩu không đúng"
        };
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          organizationId: user.organizationId,
          organization: user.organization
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }


  
  static async loginMember(email, password) {
    try {
      // Tìm user theo email
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user) {
        return {
          success: false,
          message: "Email không tồn tại"
        };
      }

      // Kiểm tra role member
      if (user.role !== "MEMBER") {
        return {
          success: false,
          message: "Chỉ member mới được đăng nhập"
        };
      }

      // Kiểm tra account có bị khóa không
      if (!user.isActive) {
        return {
          success: false,
          message: "Tài khoản đã bị khóa"
        };
      }

      // Kiểm tra password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return {
          success: false,
          message: "Mật khẩu không đúng"
        };
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          organizationId: user.organizationId,
          organization: user.organization
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}