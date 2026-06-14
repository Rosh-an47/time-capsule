const User = require("../models/user.model.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

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

module.exports = registerUser;