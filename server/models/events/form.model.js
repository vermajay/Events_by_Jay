import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "radio",
      "checkbox",
      "select",
      "file",
      "email",
      "phone",
      "date",
    ],
    required: true,
  },
  label: { type: String, required: true },
  name: { type: String, required: true }, // used in frontend & response key
  required: { type: Boolean, default: false },
  options: [{ type: String }], // for radio, checkbox, select
  placeholder: { type: String },
  validation: { type: String }, // regex pattern or validation rule
  order: { type: Number }, // To control display order
});

const formSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  fields: [formFieldSchema],
});

export default mongoose.model("Form", formSchema);