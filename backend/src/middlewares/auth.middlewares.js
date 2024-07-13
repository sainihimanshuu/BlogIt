//here we need to authenticate the user using access token from cookies

import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const authenticateUser = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.body.accessToken;

    if (!token) {
        throw new ApiError(401, "unathorized access");
    }

    try {
        var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(403, "error while decoding access token");
    }

    const user = await User.findById(decoded.id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(403, "Invalid token");
    }

    req.user = user;

    next();
});

export default authenticateUser;
