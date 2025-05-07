import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            trim: true
        },
        password:{
            type: String,
            required: true
        },
        //these two fields are for reset password
        token:{
            type: String
        },
        resetPasswordExpires:{
            type: Date
        }
    },
    { timestamps: true }      // Add timestamps for when the document is created and last modified
);

export default mongoose.model("Admin", adminSchema);