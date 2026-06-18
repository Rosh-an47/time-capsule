import { Router } from "express";
import { createCapsule } from "../controllers/capsule.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createCapsule").post(verifyJwt, upload.fields([
    {
        name: "media",
        maxCount: 1
    }
]), createCapsule);

export default router;