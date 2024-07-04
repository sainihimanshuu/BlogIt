import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { z } from "zod";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";

const generateAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //while generating access token, we also generate a new refreshToken
        await User.updateOne(
            { _id: userId },
            { $set: { refreshToken: refreshToken } }
        );

        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "error while generating tokens");
    }
};

const createUserSchema = z.object({
    username: z.string().trim(),
    email: z.string().email().trim(),
    password: z.string(),
    about: z.string().optional(),
});

const createUser = asyncHandler(async (req, res) => {
    const validatedData = createUserSchema.parse(req.body);

    const usernameExists = await User.find({
        username: validatedData.username,
    });
    if (usernameExists) {
        throw new ApiError(
            400,
            "User with username already exists, choose a new username"
        );
    }

    const emailExists = await User.find({ email: validatedData.email });
    if (emailExists) {
        throw new ApiError(
            400,
            "Account with email already exists, please login"
        );
    }

    //upload avator to cloudinary
    const avatarLocalFilePath = req.file?.path;
    const cloudinaryResponse = await uploadOnCloundinary(avatarLocalFilePath);
    const avatar = cloudinaryResponse.url;

    const userDetails = {
        ...validatedData,
        avatar: avatar,
    };

    const newUser = await User.create(userDetails).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .json({ message: "User created successfully", newUser });
});

export { createUser };
