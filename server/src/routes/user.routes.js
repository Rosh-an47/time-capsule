const {Router} = require("express");
const {registerUser, loginUser, logoutUser} = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJwt = require("../middlewares/auth.middleware.js");
const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "profilePicture",
        maxCount: 1
    } //,{} ra aaru files same way ma
]),registerUser);


router.route("/login").post(loginUser);

//secured Routes

router.route("/logout").post(verifyJwt, logoutUser);


module.exports = router;