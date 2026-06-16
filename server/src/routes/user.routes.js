import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";
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
router.route("/me").get(verifyJwt, getCurrentUser);

export default router;