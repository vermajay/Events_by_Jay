import Admin from "../../models/auth/admin.model.js";
import mailSender from "../../mail/mailSender.js";
import { resetPasswordLinkEmail } from "../../mail/passwordResetTemplate.js";
import { passwordResetSuccessfull } from "../../mail/passwordResetSuccessfullTemplate.js";
import bcrypt from "bcrypt"
import crypto from "crypto"

//resetPasswordToken - link generation and mail send
export const resetPasswordToken = async(req, res) => {
    try{
        //get email from req body
        const email = req.body.email;

        //check if email exists
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json(
                {
                    success: false,
                    message: "Admin doesn't exists"
                }
            )
        }

        //generate token
        const token = crypto.randomBytes(20).toString("hex");

        //update admin by adding token and expiration time
        const updateDetails = await Admin.findOneAndUpdate(
            {email:email}, {token:token, resetPasswordExpires:Date.now() + 5*60*1000}, {new:true}
        );
        console.log("updated admin with token and expiration-> ", updateDetails);

        //create url for resetting password
        const url = `http://localhost:5173/update-password/${token}`; //this is a link to the UI of app (frontend)
 
        //send the mail with the reset password link to the admin
        await mailSender(email, "Password Reset Link", resetPasswordLinkEmail(email, admin.name, url));

        res.status(200).json(
            {
                success: true,
                message: "Password reset link sent succesfully to admin mail",
                updateDetails
            }
        )

    }
    catch(error){
        console.log("Error in generating reset link or sending mail-> ",error.message);
        res.status(500).json(
            {
                success: false,
                messgae: "Error in generating reset link or sending mail"
            }
        )
    }
}

//resetPassword - updates password in db
export const resetPassword = async (req,res) => {
    try{
        const {token, password, confirmPassword} = req.body;

        //validate the data
        if(!password || !confirmPassword){
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }

        //fetch admin details from database using token sent in reset email
        let admin = await Admin.findOne({token:token}); 
        if(!admin){
            return res.status(400).json(
                {
                    success: false,
                    message: "Token is invalid, please regenerate your token"
                }
            )
        }

        //check if token is expired
        if(Date.now() > admin.resetPasswordExpires){
            return res.status(400).json(
                {
                    success: false,
                    message: "Token is expired, please regenerate your token"
                }
            )
        }

        //match the 2 new passwords
        if(password !== confirmPassword){
            return res.status(400).json(
                {
                    success: false,
                    message: "password and confirmPassword do not match"
                }
            )
        }

        //HASH the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return res.status(500).json(
                {
                    success: false,
                    message: "Error in hashing password"
                }
            )
        }

        //update password in database
        admin = await Admin.findOneAndUpdate({token:token}, {password:hashedPassword}, {new:true});
        console.log("Updated admin-> ", admin);

        //send the mail that the password is resetted
        await mailSender(admin.email, "Password Resetted Successfully", passwordResetSuccessfull(admin.email));

        //return successfull response
        res.status(200).json(
            {
                success: true,
                message: "Password resetted successfully"
            }
        )
    }
    catch(error){
        console.log("Error in resetting password-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in resetting password"
            }
        )
    }
}