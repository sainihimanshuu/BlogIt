import mongoose from "mongoose";
import Like from "../models/like.models.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleBlogLike = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    const isLiked = await Like.findOne({
        blog: blogId,
        likedBy: req.user?._id,
    });

    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json({ message: "unliked succesfully", isLiked: false });
    }

    const liked = await Like.create({
        blog: blogId,
        likedBy: req.user?._id,
    });

    if (!liked) {
        throw new ApiError(500, "failed to like, please try again");
    }

    return res
        .status(200)
        .json({ message: "Liked successfully", isLiked: true });
});

const getLikedBlogs = asyncHandler(async (req, res) => {
    const likedBlogs = await Like.find({
        likedBy: req.user._id,
    });

    res.status(200).json({
        message: "liked blogs fetched succesfully",
        likedBlogs,
    });
});

export { toggleBlogLike, getLikedBlogs };
