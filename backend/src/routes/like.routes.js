import { Router } from "express";
import {
    getLikedBlogs,
    toggleBlogLike,
} from "../controllers/like.controllers.js";
import verifyJwt from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/toggle/b/:blogId").post(verifyJwt, toggleBlogLike);
router.route("/getLikedBlogs").get(verifyJwt, getLikedBlogs);

export default router;
