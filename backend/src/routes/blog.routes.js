import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";
import verifyJwt from "../middlewares/auth.middlewares.js";

const router = Router();

import {
    createBlog,
    editBlog,
    deleteBlog,
    getBlog,
} from "../controllers/blog.controllers.js";

router
    .route("/createBlog")
    .post(verifyJwt, upload.single("coverImage"), createBlog);
router
    .route("/editBlog/:id")
    .post(verifyJwt, upload.single("coverImage"), editBlog);
router.route("/deleteBlog/:id").delete(verifyJwt, deleteBlog);
router.route("/getBlog/:id").get(getBlog);

export default router;
