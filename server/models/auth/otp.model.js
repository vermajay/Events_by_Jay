import mongoose from "mongoose";
import mailSender from "../../mail/mailSender.js";
import { newAdminCreationTemplate } from "../../mail/newAdminCreationTemplate.js"

const OTPSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true
        },
        otp:{
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now,
            expires: 5*60
        }
    }
);



//document save hone se just pehle ham ek verification mail bhejenge with the otp
//iska matlab OTP.create method call hone se pehle ye function chalega
//matlab database mein otp save hone se pehle user pe mail chali jayegi
//phir uss mail ka otp and database ka otp compare kiya jayega
OTPSchema.pre("save", async function (next){
    // Only send an email when a new document is created
    if(this.isNew){
        console.log("Sending mail");
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})

export default mongoose.model("OTP", OTPSchema);

async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification email from Events by Jay", newAdminCreationTemplate(otp));
        console.log("Email sent successfully", mailResponse);
    }
    catch(error){
        console.log("Error while sending mail -> ", error);
        throw error;
    }
}