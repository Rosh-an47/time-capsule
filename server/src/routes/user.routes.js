const {Router} = require("express");
const {registerUser, loginUser} = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "profilePicture",
        maxCount: 1
    } //,{} ra aaru files same way ma
]),registerUser);


module.exports = router;