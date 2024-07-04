import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

import { createUser } from "../controllers/user.controllers.js";

router.route("/createUser").post(upload.single("avatar"), createUser);

export default router;
