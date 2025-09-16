import { MemberService } from '../../services/Admin/member.service.js';

export class MemberController {
  // Member profile methods
  static async getProfileMember(req, res) {
    try {
      const user = await MemberService.getProfile(req.user.id);
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateProfileMember(req, res) {
    try {
      const { fullName, phoneNumber } = req.body;
      const updated = await MemberService.updateProfile(req.user.id, { fullName, phoneNumber });
      res.json({ message: "Profile updated successfully", user: updated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async changePasswordMember(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }
      
      await MemberService.changePassword(req.user.id, currentPassword, newPassword);
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      if (error.message === "Current password is incorrect") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async registerEventMember(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const registration = await MemberService.registerEvent(req.user.id, eventId);
      res.json({ success: true, registration });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getDashboardMember(req, res) {
    try {
      res.json({
        success: true,
        message: "Welcome to the member dashboard",
        user: req.user
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
















  
  // Admin methods
  static async getMembersList(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới truy cập" });
      }

      const filters = {
        ...req.query,
        organizationId: req.user.organizationId
      };

      const result = await MemberService.getMembersList(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createMember(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới tạo member" });
      }

      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing fields" 
        });
      }

      const memberData = {
        fullName,
        email,
        password,
        organizationId: req.user.organizationId
      };

      const member = await MemberService.createMember(memberData);
      res.json({ success: true, member });
    } catch (error) {
      if (error.message === "Email đã tồn tại") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async lockMember(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới truy cập" });
      }

      const memberId = parseInt(req.params.id);
      const member = await MemberService.lockMember(memberId);
      
      res.json({ message: "Member đã bị khóa", member });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async unlockMember(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới truy cập" });
      }

      const memberId = parseInt(req.params.id);
      const member = await MemberService.unlockMember(memberId);
      
      res.json({ message: "Member đã được mở khóa", member });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới reset password" });
      }

      const memberId = parseInt(req.params.id);
      await MemberService.resetPassword(memberId);
      
      res.json({ message: "Password đã reset về 'Member@123'" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}