const User = require("../models/user.model.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");

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

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
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
        // req body -> data
        // username or email
        // find the user
        // check password
        // access and refresh tokem

        const {email, username, password} = req.body;

        if(!username && !email){
            throw new Error("Username or Email is required");
        }

        const user = await User.findOne({$or : [{username}, {email}]});

        if(!user){
            console.log("User Doesn't exists!!");
            throw new Error("User doesn't exists!");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if(!isPasswordValid){
            console.log("Password is Incorrect");
            throw new Error("Password is Incorrect");
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

        //user lai edit gareni huncha
        const loggedInUser = User.findById(user._id).select("-password -refreshToken");

        //send cookies
        //can be seen from frontend now but can only be edited from server with this option
        const options = {
            httpOnly: true,
            secure: true
        }

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
}

const logoutUser = async (req,res) =>{
    
}



module.exports = {registerUser, loginUser, logoutUser};