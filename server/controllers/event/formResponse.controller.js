import FormResponse from "../../models/events/formResponse.model.js";
import Event from "../../models/events/event.model.js";

import jwt from "jsonwebtoken"; // to secure the QR code
import { generateQR } from "../../utils/qrGenerator.js";

import mailSender from "../../mail/mailSender.js";
import { eventRegistrationEmail } from "../../mail/eventRegistrationTemplate.js";


// Submit form response (unauthorized route for attendees)
export const submitFormResponse = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { fullName, email, phone, age, heardAbout, futureEventNotification } = req.body;

    if(!fullName || !email || !phone || !age){
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and age are required"
      });
    }
    
    // Verify event exists and is published
    const event = await Event.findById(eventId);
    if (!event || event.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: "Event not found or not accepting registrations"
      });
    }
    
    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline has passed"
      });
    }

    // Check if user has already registered with this email
    const existingResponse = await FormResponse.findOne({ 
      eventId, 
      email: email 
    });
    
    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this event"
      });
    }
    
    // Create form response
    const formResponse = await FormResponse.create({
      eventId,
      fullName,
      email,
      phone,
      age,
      heardAbout: heardAbout || "Not provided",
      futureEventNotification: futureEventNotification || false
    });
    
    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully. Awaiting approval.",
      data: formResponse
    });
  } catch (error) {
    console.log("Error submitting form response:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing your registration"
    });
  }
};

// Get all responses for an event
export const getFormResponsesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query; // Optional filter by status
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Build query
    let query = { eventId };
    if (status) {
      query.status = status;
    }
    
    // Fetch responses
    const responses = await FormResponse.find(query).sort({ submittedAt: -1 });
    
    return res.status(200).json({
      success: true,
      message: "Responses fetched successfully",
      data: responses
    });
  } catch (error) {
    console.log("Error fetching form responses:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching responses"
    });
  }
};

// Get a single response by ID
export const getFormResponseById = async (req, res) => {
  try {
    const { responseId } = req.params;
    
    const response = await FormResponse.findById(responseId);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Response fetched successfully",
      data: response
    });
  } catch (error) {
    console.log("Error fetching form response:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching response"
    });
  }
};

// Approve a form response (sends QR code to the attendee via email)
export const approveFormResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    
    // Find the response
    const response = await FormResponse.findById(responseId);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found"
      });
    }
    
    // Check if already approved
    if (response.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: "Response is already approved"
      });
    }
    
    // Generate QR code with secure JWT
    const qrData = {
      responseId: response._id.toString(),
      eventId: response.eventId.toString(),
      email: response?.email || "",
      timestamp: Date.now()
    };
    
    // Sign the data with JWT to secure it
    const token = jwt.sign(qrData, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Generate QR code with the JWT token
    const qrCode = await generateQR(token);
    
    console.log("QR Code:", qrCode);

    // Update response status
    response.status = 'approved';
    response.qrCode = qrCode;
    
    await response.save();
    
    // Fetch the updated response to return the latest data
    const updatedResponse = await FormResponse.findById(responseId);
    
    // Fetch event details to include in email
    const event = await Event.findById(response.eventId);
    
    if (event && response.email) {
      // Send email with QR code to attendee
      await mailSender(
        response.email,
        `Registration Confirmed: ${event.title}`,
        eventRegistrationEmail(
          event.title,
          event.description || "No description provided",
          event.location || "No location provided",
          event.startDate,
          event.endDate,
          qrCode
        )
      );
    }
    
    return res.status(200).json({
      success: true,
      message: "Response approved successfully and confirmation email sent",
      data: updatedResponse
    });
  } catch (error) {
    console.log("Error approving form response:", error);
    return res.status(500).json({
      success: false,
      message: "Error approving response"
    });
  }
};

// Reject a form response
export const rejectFormResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    
    // Find the response
    const response = await FormResponse.findById(responseId);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found"
      });
    }
    
    // Check if response is in pending status
    if (response.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Only pending responses can be marked as rejected"
      });
    }
    
    // Update response status
    response.status = 'rejected';
    
    await response.save();

    // Fetch the updated response to return the latest data
    const updatedResponse = await FormResponse.findById(responseId);
    
    return res.status(200).json({
      success: true,
      message: "Response rejected successfully",
      data: updatedResponse
    });
  } catch (error) {
    console.log("Error rejecting form response:", error);
    return res.status(500).json({
      success: false,
      message: "Error rejecting response"
    });
  }
};

// Mark attendance (admin scans QR code and hits this endpoint)
export const markAttendance = async (req, res) => {
  try {
    const { qrToken } = req.body;
    
    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR code data is missing or invalid"
      });
    }
    
    // Verify the JWT token
    let decodedData;
    try {
      decodedData = jwt.verify(qrToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired QR code"
      });
    }
    
    const { responseId } = decodedData;
    
    // Find the response
    const response = await FormResponse.findById(responseId);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }
    
    // Check if registration is approved
    if (response.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: "Registration is not approved"
      });
    }
    
    // Check if already marked as present
    if (response.checkedInAt) {
      return res.status(400).json({
        success: false,
        message: "Attendee already checked in"
      });
    }
    
    // Mark attendance by setting checkedInAt timestamp
    response.checkedInAt = Date.now();
    
    await response.save();
    
    // Fetch the updated response to return the latest data
    const updatedResponse = await FormResponse.findById(responseId);
    
    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: updatedResponse
    });
  } catch (error) {
    console.log("Error marking attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking attendance"
    });
  }
};

// Get attendance stats for an event
export const getAttendanceStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Get stats
    const totalResponses = await FormResponse.countDocuments({ eventId });
    const pendingResponses = await FormResponse.countDocuments({ eventId, status: 'pending' });
    const approvedResponses = await FormResponse.countDocuments({ eventId, status: 'approved' });
    const rejectedResponses = await FormResponse.countDocuments({ eventId, status: 'rejected' });
    const presentAttendees = await FormResponse.countDocuments({ eventId, checkedInAt: { $ne: null } });
    
    return res.status(200).json({
      success: true,
      message: "Attendance stats fetched successfully",
      data: {
        totalResponses,
        pendingResponses,
        approvedResponses,
        rejectedResponses,
        presentAttendees,
        approvalRate: totalResponses > 0 ? (approvedResponses / totalResponses * 100).toFixed(2) + '%' : '0%',
        attendanceRate: approvedResponses > 0 ? (presentAttendees / approvedResponses * 100).toFixed(2) + '%' : '0%'
      }
    });
  } catch (error) {
    console.log("Error fetching attendance stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance stats"
    });
  }
};