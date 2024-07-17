import { Router } from "express";
import verifyJwt from "../middlewares/auth.middlewares.js";

const router = Router();

import {
    toggleFollowing,
    getFollowedUser,
    isFollowed,
} from "../controllers/follow.controllers.js";

router.route("/toggleFollowing/:userId").post(verifyJwt, toggleFollowing);
router.route("/getFollowedUsers").get(verifyJwt, getFollowedUser);
router.route("/isFollowed/:userId").get(verifyJwt, isFollowed);

export default router;
