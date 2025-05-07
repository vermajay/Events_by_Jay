import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ["draft", "published", "completed"],
    default: "draft",
  },
  startDate: { type: Date },
  endDate: { type: Date },
  registrationDeadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Event", eventSchema);