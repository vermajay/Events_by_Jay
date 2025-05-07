import { Router } from "express";

import {
  getFormByEventId,
  updateFormByEventId,
} from "../controllers/event/form.controller.js";

import auth from "../middlewares/auth.js";

const router = Router();

// Get form by event ID
router.get("/getFormByEventId/:eventId", auth, getFormByEventId);

// Update form by event ID
router.put("/updateFormByEventId/:eventId", auth, updateFormByEventId);

export default router;