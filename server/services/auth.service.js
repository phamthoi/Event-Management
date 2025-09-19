import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthService {

  static async login(email, password) {
    try {

  
      
     
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

     
      if (!user.isActive) {
        return {
          success: false,
          message: "Tài khoản đã bị khóa"
        };
      }

    
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return {
          success: false,
          message: "Mật khẩu không đúng"
        };
      }

    
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId
        },
        process.env.JWT_SECRET,
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