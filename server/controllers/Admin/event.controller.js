import { EventService } from '../../services/Admin/event.service.js';

export class EventController {
  static async createEvent(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới tạo event" });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid token: user not found" 
        });
      }

      const eventData = {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id
      };

      const event = await EventService.createEvent(eventData);
      res.json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getEventsList(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới truy cập" });
      }

      const filters = {
        ...req.query,
        // Thay đổi từ createdById sang organizationId
        organizationId: req.user.organizationId
      };

      const result = await EventService.getEventsList(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getEventById(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới truy cập" });
      }

      const event = await EventService.getEventById(parseInt(req.params.id));
      
      if (!event) {
        return res.status(404).json({ message: "Event không tồn tại" });
      }

      res.json({ success: true, event });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateEvent(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới update event" });
      }

      const eventId = parseInt(req.params.id);
      const event = await EventService.updateEvent(eventId, req.body);
      
      res.json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteEvent(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới xóa event" });
      }

      const eventId = parseInt(req.params.id);
      await EventService.deleteEvent(eventId);
      
      res.json({ success: true, message: "Event deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getEventRegistrations(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới truy cập" });
      }

      const eventId = parseInt(req.params.id);
      const registrations = await EventService.getEventRegistrations(eventId, req.user.organizationId);
      
      res.json({ success: true, registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateAttendance(req, res) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Chỉ admin mới cập nhật attendance" });
      }

      const { updates } = req.body;
      await EventService.updateAttendance(updates);
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}