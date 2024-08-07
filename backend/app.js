import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        //origin: String(process.env.CORS_ORIGIN),
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./src/routes/user.routes.js";
import blogRouter from "./src/routes/blog.routes.js";
import likeRouter from "./src/routes/like.routes.js";
import followRouter from "./src/routes/follow.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/follow", followRouter);

export default app;
