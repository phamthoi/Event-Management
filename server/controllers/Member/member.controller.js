// controllers/Member/member.controller.js
import * as memberService from '../../services/Member/member.service.js';

// GET /member/profile - Lấy thông tin profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await memberService.getMemberProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// PUT /member/profile - Cập nhật profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phoneNumber } = req.body;
    
    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    
    const updatedProfile = await memberService.updateMemberProfile(userId, {
      fullName,
      phoneNumber
    });
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// PUT /member/profile/password - Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Thêm phần code này:
    const result = await memberService.changeMemberPassword(userId, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// GET /member/members - Lấy danh sách members cùng organization
export const getMembers = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const { page = 1, limit = 10, email = '', fullName = '' } = req.query;
    
    const result = await memberService.getMembersByOrganization(
      organizationId, 
      parseInt(page), 
      parseInt(limit),
      { email, fullName }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// GET /member/events - Lấy events đã đăng ký
export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await memberService.getMemberEvents(userId);
    res.json(events);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// GET /member/events/upcoming - Lấy upcoming events
export const getUpcomingEvents = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await memberService.getUpcomingEvents(organizationId, userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// POST /member/events/:eventId/register - Đăng ký event
export const registerEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const registration = await memberService.registerForEvent(userId, eventId);
    res.json({ message: 'Successfully registered for event', registration });
  } catch (error) {
    console.error('Register event error:', error);
    if (error.message.includes('not found') || 
        error.message.includes('not open') || 
        error.message.includes('ended') ||
        error.message.includes('full') ||
        error.message.includes('Already registered')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// DELETE /member/events/:eventId/register - Hủy đăng ký event
export const cancelEventRegistration = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const result = await memberService.cancelEventRegistration(userId, eventId);
    res.json({ message: 'Successfully cancelled registration', result });
  } catch (error) {
    console.error('Cancel registration error:', error);
    if (error.message.includes('not found') || 
        error.message.includes('Cannot cancel')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};