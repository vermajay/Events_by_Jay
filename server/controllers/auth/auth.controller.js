import Admin from "../../models/auth/admin.model.js";
import OTP from "../../models/auth/otp.model.js";
import otpGenerator from "otp-generator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

//send otp
export const sendOTP = async(req, res) => {
    try{
        //fetch email from req body
        const {email} = req.body;

        //if admin already exists, then send it back
        const checkAdminPresent = await Admin.findOne({email});
        if(checkAdminPresent){
            return res.status(401).json(
                {
                    success: false,
                    message: "Admin already exists, go to login"
                }
            )
        }

        //generate otp
        var otp;
        var result = true;

        //make sure that the otp generated is unique
        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            result = await OTP.findOne({otp: otp});
        }

        //create an entry for otp
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);

        //return successfull response
        res.status(200).json(
            {
                success: true,
                message: "OTP sent to the admin and saved to the DB successfully",
                data: otpBody
            }
        )

    }
    catch(error){
        console.log("Error in sending otp-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in sending otp"
            }
        )
    }
}

//signup
export const signUp = async(req, res) => {
    try{
        //data fetch from req body
        const {
            name,
            email,
            password,
            otp
        } = req.body;

        //validate the data
        if(!name || !email || !password || !otp){
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }

        //check if admin already exists
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json(
                {
                    success: false,
                    message: "Admin already registered, go to login"
                }
            )
        }

        //find most recent otp stored for the admin
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length == 0){
            return res.status(400).json(
                {
                    success: false,
                    message: "OTP not found in database"
                }
            )
        }
        if(otp !== recentOtp.otp){
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid OTP"
                }
            )
        }

        //now OTPs are matched (otp stored in db == otp written by admin)

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

        //create entry in DB

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        })

        //return successfull response
        res.status(200).json(
            {
                success: true,
                message: "Admin registered successfully",
                admin
            }
        )

    }
    catch(error){
        console.log("Error in registering admin-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in registering admin"
            }
        )
    }
}

//login
export const login = async(req,res) => {
    try{
        //fetch data from req body
        const {email, password} = req.body;

        //validate the data
        if(!email || !password){
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }
        
        //check if admin exists or not
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(401).json(
                {
                    success: false,
                    message: "Admin not registered, please signup first"
                }
            )
        }

        //match the password
        if(await bcrypt.compare(password, admin.password)){
            //now passwords are matched

            //generate JWT
            const payload = {
                email: admin.email,
                id: admin._id,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "48h"
            });

            admin.token = token;
            admin.password = undefined;  //make the password field undefined as we are going to send it in response
                                        //so that hacker can't steal it

            //define options to send in cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), //cookie expires in 3 days (it is in milliseconds)
                httpOnly: true                                //httpOnly means client cannot access the cookie (for security)
            }

            res.cookie("token", token, options).status(200).json(         //sending cookie in response
                {
                    success: true,
                    token,
                    admin,
                    message: "Admin logged in successfully"
                }
            )
        }
        else{
            //passwords do not match
            return res.status(401).json(           //403 - client error forbidden
                {
                    success: false,
                    message: "Password do not match"
                }
            )
        }

    }
    catch(error){
        console.log("Error in logging in admin-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in logging in admin"
            }
        )
    }
}