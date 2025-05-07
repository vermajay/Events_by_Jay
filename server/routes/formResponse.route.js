import { Router } from "express";

import {
  submitFormResponse,
  getFormResponsesByEvent,
  getFormResponseById,
  approveFormResponse,
  rejectFormResponse,
  markAttendance,
  getAttendanceStats,
} from "../controllers/event/formResponse.controller.js";

import auth from "../middlewares/auth.js";

const router = Router();

// Submit form response (unauthorized route for attendees)
router.post("/submitFormResponse/:eventId", submitFormResponse);

// Get all responses for an event
router.get("/getFormResponsesByEvent/:eventId", auth, getFormResponsesByEvent);

// Get a single response by ID
router.get("/getFormResponseById/:responseId", auth, getFormResponseById);

// Approve a form response
router.put("/approveFormResponse/:responseId", auth, approveFormResponse);

// Reject a form response
router.put("/rejectFormResponse/:responseId", auth, rejectFormResponse);

// Mark attendance (scan QR code)
router.post("/markAttendance", auth, markAttendance);

// Get attendance stats for an event
router.get("/getAttendanceStats/:eventId", auth, getAttendanceStats);

export default router;