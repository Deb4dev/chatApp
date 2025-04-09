import {User } from "../models/user.model.js"
import bcrypt from "bcryptjs"; //importing bcryptjs for hashing the password
import{generateToken} from "../lib/util.js" //importing the generate token function from utils folder

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  //console.log("BODY:", req.body);
  
  try {
    if(!email || !fullName || !password){
        res.status(400).json({message:"please fill all the fields"})
      }
    if (password.length < 6) {//checking if the password is write length
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email }); //finding the user according to the email so that i can understand that they are there or not in DB
    if (user) {
      return res.status(400).json({ message: "email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      fullName: fullName,
      password: hashedPassword,
    });

    if(newUser){
        //generate the required jwt token which is imported from some other folder which is utils,js of lib
        generateToken(newUser._id,res)
        //save the newuser
        await newUser.save()

        return res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })
    }
    else{
        return res.status(400).json({message:"user not created"})
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};


//we are going to get the  email and password from the req and use it 
//if we have  a email in user with that same email
//we'll generate jwt token and send it 
//other wise show invalid credentials
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "invalid credentials" });
      }

      generateToken(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    } catch (eror) {
      console.log("Error in login controller", error.message);
      return res.status(500).json({ message: "internal server error" });
    }
};

//find the cookie
//if you get the cookie just clear it and make the time of that to 0
//and send the response of logout 
export const logout = (req, res) => {
  try{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"logged out successfully"})
  }catch(error){
    console.log("Error in logout controller",error.message);
    return res.status(500).json({message:"internal server error"})
  }
}


export const updateProfile = async (req,res)=>{//takes the req, res and next to where we check if the user is logged in by the cookie in a middleware , this middleware is associated in the router
    try{
       const {profilePic} = req.body
       const user = req.user._id
  
       if(!profilePic){
        return res.status(400).json({message:"please provide the profile pic"})
       }

       const uploadResponse = await cloudinary.uploader.upload(profilePic  )

       const updatedUser = await user.findbyIdAndUpdate(user,{
        profilepic : uploadResponse.secure_url
       },{
          new: true
       })

       res.status(200).json(updatedUser)

    }catch(error){
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}


export const checkAuth = (req,res)=>{
    try{
      res.status(200).json(req.user)
    }catch(error){
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}