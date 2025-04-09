import { User } from "../models/user.model.js"
import { Message } from "../models/message.model.js"
import {cloudinary} from "../lib/cloudinary.js"

//finds all the users in  the contacts except himself and shows them on the sidebar
export const getUsers = async (req, res) => {
    try{
        const loggedInUser = req.user._id
        const filteredUsers = await User.find({_id:{$ne:loggedInUser}}).select("-password")

        res.status(200).json(filteredUsers)

    }catch(error){

        console.log("error in gettting the sidebar of users")
        res.status(500).json({error:"internal  serve error"})
    }

}

export const getMessages = async(req,res)=>{
    try{
        const {id : usertoChatId} = req.params
        const myId = req.user._id
        const message = await Message.find(
            {
                $or:[
                    {senderId:myId , recieverId :usertoChatId},
                    {senderId:usertoChatId , recieverId :myId}
                ],
            }
        )
        res.status(200).json(message)
    }catch(error){
        console.log("error in getting the messages")
        res.status(500).json({error:"internal server error"})
    }
    
}

export const sendMessage = async(req,res)=>{
    try{
        const {text,image} = req.body
        const {id : usertoChatId} = req.params
        const senderId = req.user._id

        let imageUrl 
        if(image){

            const uploadResponse = await cloudinary.uploader.upload(image)
        }


        const newMessage = await Message({
            senderId,
            recieverId : usertoChatId,
            text,
            image : imageUrl,
        })


        await newMessage.save()

    }catch(error){

    }
}