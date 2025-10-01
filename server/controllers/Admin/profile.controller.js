import * as profileService from '../../services/Admin/profile.service.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await profileService.getAdminProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phoneNumber, avatarUrl } = req.body;
    
    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    
    const updatedProfile = await profileService.updateAdminProfile(userId, {
      fullName,
      phoneNumber,
      avatarUrl
    });
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const result = await profileService.changeAdminPassword(userId, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};