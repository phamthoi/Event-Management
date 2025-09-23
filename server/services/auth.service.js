//server/services/auth.service.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer.js";
import { createResetCode, verifyResetCode, markCodeUsed } from "./passwordReset.service.js";

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

// Forgot password: create code + send email
export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const code = await createResetCode(email);

  // send plain code via email
  await sendMail(
    email,
    "Password reset code",
    `Your reset code is: ${code}`,
    `<p>Your reset code: <strong>${code}</strong></p><p>Valid for ${15} minutes.</p>`
  );

  return { success: true, message: "Reset code sent to email" };
}

// Verify code: return true/false (or throw)
export async function verifyCode(email, code) {
  const record = await verifyResetCode(email, code);
  if (!record) throw new Error("Invalid or expired code");
  return { success: true, message: "Code valid" , recordId: record.id};
}

// Reset password: verify then update user passwordHash
export async function resetPassword(email, code, newPassword) {
  if (!email || !code || !newPassword) {
    throw new Error("Email, code và newPassword là bắt buộc");
  }
  
  const record = await verifyResetCode(email, code);
  if (!record) throw new Error("Invalid or expired code");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashed },
  });

  // mark code as used
  await markCodeUsed(record.id);

  return { success: true, message: "Password reset successful" };
}