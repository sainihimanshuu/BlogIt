import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";
import verifyJwt from "../middlewares/auth.middlewares.js";

const router = Router();

import {
    createUser,
    loginUser,
    logOut,
    getCurrentUser,
    accountProfile,
    updateAccountDetails,
    refreshAccessToken,
} from "../controllers/user.controllers.js";

router.route("/createUser").post(upload.single("avatar"), createUser);
router.route("/loginUser").post(loginUser);
router.route("/logOut").post(verifyJwt, logOut);
router.route("/getCurrentUser").get(verifyJwt, getCurrentUser);
router.route("/accountProfile/:id").get(accountProfile);
router.route("/updateAccountDetails").post(verifyJwt, updateAccountDetails);
router.route("/refreshToken").get(refreshAccessToken);

export default router;
