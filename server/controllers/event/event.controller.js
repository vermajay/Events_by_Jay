import Event from "../../models/events/event.model.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      registrationDeadline
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !startDate || !endDate || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Create event with admin ID from auth middleware
    const event = await Event.create({
      title,
      description,
      location,
      startDate,
      endDate,
      registrationDeadline
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    console.log("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating event"
    });
  }
};

// Get all events 
export const getAllEvents = async (req, res) => {
    try {
      // Fetch all events without any filtering
      const events = await Event.find().sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        message: "Events fetched successfully",
        data: events
      });
    } catch (error) {
      console.log("Error fetching events:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching events"
      });
    }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event
    });
  } catch (error) {
    console.log("Error fetching event:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching event"
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Update event and get the updated document
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { ...updateData },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.log("Error updating event:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating event"
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Delete the event
    await Event.findByIdAndDelete(eventId);
    
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.log("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting event"
    });
  }
};

// Update event status (draft, published, completed)
export const updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !["draft", "published", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'draft', 'published', or 'completed'"
      });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Update status
    event.status = status;
    await event.save();
    
    return res.status(200).json({
      success: true,
      message: `Event status updated to ${status} successfully`,
      data: event
    });
  } catch (error) {
    console.log("Error updating event status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating event status"
    });
  }
};