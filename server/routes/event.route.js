import { Router } from "express";

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
} from "../controllers/event/event.controller.js";

import auth from "../middlewares/auth.js";

const router = Router();

// Create a new event
router.post("/createEvent", auth, createEvent);

// Get all events
router.get("/getAllEvents", auth, getAllEvents);

// Get a single event by ID
router.get("/getEventById/:eventId", getEventById);

// Update an event
router.put("/updateEvent/:eventId", auth, updateEvent);

// Delete an event
router.delete("/deleteEvent/:eventId", auth, deleteEvent);

// Update event status (draft, published, completed)
router.put("/updateEventStatus/:eventId", auth, updateEventStatus);

export default router;