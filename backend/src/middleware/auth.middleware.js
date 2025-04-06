import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
//get the jwt token from the cookie generated
// if !token send unauthorized
//when you get the token check it with jwt verify to generate the decoded token 
//if you get the decoded token then find the user by that decoded token  .. 
// as the token was generated  by the userId it'll 
// get the userId and can find the user by that
//when you get the user send it as a req to the next function

export const protectRoute = async (req,res , next) =>{
    try{
        const token  = req.cookies.jwt
        if(!token){
            return res.status(401).json({message : "unauthorized"})
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET_KEY)
        if(!decode){
            return res.status(401).json({message : "invalid token"})
        }
        
        const user = await User.findOne(decode.userId).select("-password")// we put a - before the password to not get the password in the response

        if(!user){
            return res.status(401).json({message : "user not found"})
        }

        req.user = user; // we are putting the user in the req so that we can use it in the next function

        next()

    }catch(error){
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }


}