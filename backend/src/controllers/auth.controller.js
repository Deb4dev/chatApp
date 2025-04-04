import  {User}  from "../models/user.model.js";
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

export const login = (req, res) => {
  res.send("login");
};
