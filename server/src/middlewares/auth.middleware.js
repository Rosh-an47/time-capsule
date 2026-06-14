const { jwt } = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJwt = async(req, res, next) => {
    try {
        //mobile ma cookie hunna
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new Error("Unauthorized Request!");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new Error("Invalid Access Token");
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in authentication!!", error);
    }
}



module.exports = verifyJwt;