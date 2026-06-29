import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Request! No token provided." });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token - User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authentication:", error.message);
        return res.status(401).json({ message: "Authentication failed. Please login again." });
    }
};

export default verifyJwt;