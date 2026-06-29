import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
        
    } catch (error) {
        throw new Error("Error Generating access and refresh token ");  
    }
}

const registerUser = async (req, res) => {
    try {
        const { username, displayName, email, password } = req.body;

        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!email || email.trim() === "") {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required" });
        }

        const existedUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existedUser) {
            return res.status(400).json({ message: "User with same username or email already exists!!" });
        }

        const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
        let profilePicture;
        if (profilePictureLocalPath) {
            profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

            if (!profilePicture) {
                console.log("Profile Picture Upload Failed!");
                profilePicture = null;
            }
        }

        const user = await User.create({
            username: username.trim(),
            displayName: displayName ? displayName.trim() : "",
            email: email.trim(),
            password,
            profilePicture: profilePicture?.url || "",
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken").lean();
        if (!createdUser) {
            return res.status(500).json({ message: "Error creating user!!" });
        }

        return res.status(201).json({ 
            message: "User Registered Successfully", 
            data: createdUser 
        });
    } catch (err) {
        console.error("registerUser error:", err);
        return res.status(500).json({ 
            message: err.message || "Server Error" 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Username or Email is required" });
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist!" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is Incorrect" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id)
            .select("-password -refreshToken")
            .lean();

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Logged In successfully",
                user: loggedInUser,
                accessToken,
                refreshToken
            });
    } catch (err) {
        console.error("Error Loggin in!! ", err);
        return res.status(500).json({
            message: err.message || "Server Error"
        });
    }
};

const logoutUser = async (req,res) =>{
    const userId = req.user._id;

    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            returnDocument: "after"
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        message : "User Logged Out Successfully"
    }
    )
}


const getCurrentUser = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id)
            .select("-password -refreshToken")
            .lean();
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            message: "User fetched successfully",
            data: user
        });
    } catch(err){
        console.error("Error fetching user:", err);
        return res.status(500).json({message: "Server Error"});
    }
};


export { registerUser, loginUser, logoutUser, getCurrentUser };