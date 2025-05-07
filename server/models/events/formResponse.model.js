import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  fullName:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true,
  },
  age:{
    type: Number,
    required: true,
  },
  heardAbout:{    //How they heard about the event
    type: String,
  },
  futureEventNotification:{  //Future event notification
    type: Boolean,
    default: false,
  },
  submittedAt:{  // When the form was submitted
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  qrCode:{    // Generated QR code string/url
    type: String,
  },
  checkedInAt:{  // When the QR was scanned, this also marks the user's attendance
    type: Date,
    default: null,
  },
});

export default mongoose.model("FormResponse", formResponseSchema);