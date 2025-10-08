import { io } from "../../../server.js";

export class SocketService {


  static emitToUser(userId, event, data) {
    try {
      io.to(`user-${userId}`).emit(event, data);
      
    } catch (error) {
      console.error(`❌ Failed to emit to user ${userId}:`, error);
    }
  }


  static emitToOrganization(organizationId, event, data) {
    try {
      io.to(`org-${organizationId}`).emit(event, data);
      
    } catch (error) {
      console.error(`❌ Failed to emit to organization ${organizationId}:`, error);
    }
  }


}