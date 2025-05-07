import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  responses: { type: Object, required: true }, // key-value pairs from form submission
  submittedAt: { type: Date, default: Date.now }, // When the form was submitted
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  email: { type: String }, // Email of the attendee fetched from the responses (if provided)
  qrCode: { type: String }, // Generated QR code string/url
  checkedInAt: { type: Date }, // When the QR was scanned, this also marks the user's attendance
});

export default mongoose.model("FormResponse", formResponseSchema);