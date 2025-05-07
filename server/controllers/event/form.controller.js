import Form from "../../models/events/form.model.js";
import Event from "../../models/events/event.model.js";

// Create default form for an event - called automatically when an event is created
// This is called from the event controller and not from the frontend
export const createDefaultForm = async (eventId) => {
  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("Error creating default form: Event not found");
      return null;
    }
    
    // Check if form already exists for this event
    const existingForm = await Form.findOne({ eventId });
    if (existingForm) {
      console.log("Form already exists for this event");
      return existingForm;
    }
    
    // Default fields - name, email, and phone
    const defaultFields = [
      {
        type: "text",
        label: "Name",
        name: "Name",
        required: true,
        placeholder: "Enter your name",
        order: 1
      },
      {
        type: "email",
        label: "Email Address",
        name: "email",
        required: true,
        placeholder: "Enter your email address",
        order: 2
      },
      {
        type: "phone",
        label: "Phone Number",
        name: "phone",
        required: true,
        placeholder: "Enter your phone number",
        order: 3
      }
    ];
    
    // Create new form with default fields
    const form = await Form.create({
      eventId,
      fields: defaultFields
    });
    
    console.log("Default form created successfully for event:", eventId);
  } catch (error) {
    console.log("Error creating default form:", error);
  }
};

// Get form by event ID
export const getFormByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const form = await Form.findOne({ eventId });
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found for this event"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Form fetched successfully",
      data: form
    });
  } catch (error) {
    console.log("Error fetching form:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching form"
    });
  }
};

// Update form by event ID
export const updateFormByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { fields } = req.body;
    
    const form = await Form.findOne({ eventId });
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }
    
    // Update fields if provided
    if (fields && Array.isArray(fields) && fields.length > 0) {
      form.fields = fields;
    }
    
    // Save the updated form
    await form.save();
    
    // Fetch the updated form to ensure we return the latest data
    const updatedForm = await Form.findOne({ eventId });
    
    return res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updatedForm
    });
  } catch (error) {
    console.log("Error updating form:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating form"
    });
  }
};