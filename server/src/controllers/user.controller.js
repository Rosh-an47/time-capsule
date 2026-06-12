const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const registerUser = asyncHandler( async (req,res) => {
    
    const {username, displayName, email, password} = req.body;

    if(!username || username.trim() === ""){
        throw new Error("Username is required");
    }

    if(!email || email.trim() === ""){
        throw new Error("Email is required");
    }

    if(!password || password.trim() === ""){
        throw new Error("Password is required");
    }

    //check if user already exists 

    const existedUser = await User.findOne({
        $or: [{username}, {email}]

    });

    if(existedUser){
        throw new Error("User with same username or email already exists!!");
    }

    const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
    let profilePicture;
    if(profilePictureLocalPath){
        profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
        
        if(!profilePicture){
            throw new Error("Profile Pic Upload Failed!! ")
        }
    }

    const user = asyncHandler(await User.create({
        username,
        displayName: displayName? displayName : "",
        email,
        password,
        profilePicture: profilePicture?.url || ""
    }));

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new Error("Error creating user!! ");
    }

    res.status(200).json({
        message: "User Registered Successfully",
        data: createdUser
    });
});

module.exports = registerUser;