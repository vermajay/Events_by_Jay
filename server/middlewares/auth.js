import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

//auth
const auth = async(req, res, next) => {
    try{
        //extract token
        const token = req.cookies?.token || req.header("Authorization").replace("Bearer ", "");

        //if no token found, return response
        if(!token){
            return res.status(401).json(
                {
                    success: false,
                    message: "No token found"
                }
            )
        }

        //validate the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = decode;
        }
        catch(error){
            return res.status(401).json(
                {
                    success: false,
                    message: "Token is invalid"
                }
            )
        }
        next();
    }
    catch(error){
        console.log("Error in verifying token-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in verifying token"
            }
        )
    }
}

export default auth;