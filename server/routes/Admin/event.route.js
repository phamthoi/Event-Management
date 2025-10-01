import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { EventController } from "../../controllers/Admin/event.controller.js";

const router = express.Router();


router.post("/create", authMiddleware, EventController.createEvent);


router.get("/list", authMiddleware, EventController.getEventsList);


router.get("/detail/:id", authMiddleware, EventController.getEventById);


router.put("/edit/:id", authMiddleware, EventController.updateEvent);


router.delete("/delete/:id", authMiddleware, EventController.deleteEvent);


router.get("/ongoing", authMiddleware, EventController.getOngoingEvents);


router.get("/registrations/:id", authMiddleware, EventController.getEventRegistrations);


//router.put("/attendance", authMiddleware, EventController.updateAttendance);


router.put("/registrations/update-status", authMiddleware, EventController.updateRegistrationStatus);

export default router;