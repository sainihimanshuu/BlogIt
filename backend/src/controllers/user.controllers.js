import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //while generating access token, we also generate a new refreshToken
        await User.updateOne(
            { _id: userId },
            { $set: { refreshToken: refreshToken } }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "error while generating tokens");
    }
};

const createUserSchema = z.object({
    username: z
        .string()
        .regex(/^[a-zA-Z_]+$/)
        .min(3, { message: "username must be at least 3 character " })
        .max(20, { message: "username can be max 20 character" })
        .trim(),
    email: z.string().email().trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    about: z.string().optional(),
});

const createUser = asyncHandler(async (req, res) => { 
    const validatedData = createUserSchema.parse(req.body);

    //need to check if this can be done by zod
    const usernameExists = await User.findOne({
        username: validatedData.username,
    });
    if (usernameExists) {
        throw new ApiError(
            400,
            "User with username already exists, choose a new username"
        );
    }

    //need to check if this can be done by zod
    const emailExists = await User.findOne({ email: validatedData.email });
    if (emailExists) {
        throw new ApiError(
            400,
            "Account with email already exists, please login"
        );
    }

    //upload avator to cloudinary
    let userDetails = validatedData;

    if (req.file) {
        const avatarLocalFilePath = req.file?.path;
        const cloudinaryResponse =
            await uploadOnCloundinary(avatarLocalFilePath);
        const avatar = cloudinaryResponse;

        userDetails = {
            ...userDetails,
            avatar: {
                public_id: avatar.public_id,
                url: avatar.url,
            },
        };
    }

    const newUser = await User.create(userDetails);

    const user = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    return res.status(200).json({ message: "User created successfully", user });
});

const loginUserSchema = z.object({
    email: z.string().email().trim(),
    password: z.string(),
});
// .or(
//     z.object({
//         username: z
//             .string()
//             .regex(/^[a-zA-Z_]+$/)
//             .trim(),
//         password: z.string(),
//     })
// );

const loginUser = asyncHandler(async (req, res) => {
    const validatedData = loginUserSchema.parse(req.body);
    const fields = Object.keys(validatedData);

    const isUser = await User.findOne({
        [fields[0]]: validatedData[fields[0]],
    });
    if (!isUser) {
        throw new ApiError(400, "Please signup first");
    }

    const isPasswordCorrect = await isUser.isPasswordCorrect(
        validatedData.password
    );
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        isUser._id
    );

    const user = await User.findById(isUser._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "Login successfull", user, accessToken });
});

const logOut = asyncHandler(async (req, res) => {
    const user = req.user;

    await User.findByIdAndUpdate(user._id, { refreshToken: "" });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "Logout successful" });
});

//on clicking the avatar icon
const getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
    if (!currentUser) {
        throw new ApiError(400, "User doesn't exist");
    }

    return res
        .status(200)
        .json({ message: "user fetched successfully", currentUser });
});

//on clicking the author name
const accountProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const accountBlogs = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "blogs",
                localField: "_id",
                foreignField: "author",
                as: "blogs",
            },
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                about: 1,
                blogs: {
                    _id: 1,
                    title: 1,
                    coverImage: 1,
                },
            },
        },
    ]);

    return res.status(200).json({
        message: "account detatils fetched",
        accountBlogs: accountBlogs[0],
    });
});

const updateAccountDetailsSchema = z.object({
    username: z
        .string()
        .regex(/^[a-zA-Z_]+$/)
        .trim()
        .optional(),
    email: z.string().email().trim().optional(),
    about: z.string().optional(),
});

//on clicking edit account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const validatedData = updateAccountDetailsSchema.parse(req.body);

    //need to check if this can be done by zod
    if (validatedData.username) {
        const usernameExists = await User.findOne({
            username: validatedData.username,
        });
        if (usernameExists) {
            throw new ApiError(
                400,
                "User with username already exists, choose a new username"
            );
        }
    }
    //need to check if this can be done by zod
    if (validatedData.email) {
        const emailExists = await User.findOne({ email: validatedData.email });
        if (emailExists) {
            throw new ApiError(
                400,
                "Account with email already exists, please login"
            );
        }
    }

    let user = await User.findById(req.user._id);
    const fields = Object.keys(validatedData);
    fields.forEach(
        (field) => (user._doc = { ...user._doc, [field]: validatedData[field] })
    );

    const updatedUser = await User.findByIdAndUpdate(req.user._id, user, {
        new: true,
    }).select("-password -refreshToken");

    // we need to refresh the access token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        req.user._id
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "update successful", updatedUser });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const oldToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!oldToken) {
        throw new ApiError(401, "Unauthorized access, no refresh token");
    }

    const decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (oldToken != user.refreshToken) {
        throw new ApiError(
            401,
            "Unauthorized access, refresh token does not match"
        );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "tokens refreshed" });
});

export {
    createUser,
    loginUser,
    logOut,
    getCurrentUser,
    accountProfile,
    updateAccountDetails,
    refreshAccessToken,
};
