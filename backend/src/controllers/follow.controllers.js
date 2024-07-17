import asyncHandler from "../utils/asyncHandler.js";
import Follow from "../models/follower.models.js";
import mongoose from "mongoose";

const toggleFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const isFollowed = await Follow.findOne({
        follower: req?.user?._id,
        following: userId,
    });

    if (!isFollowed) {
        await Follow.create({
            follower: req?.user?._id,
            following: userId,
        });

        return res
            .status(200)
            .json({ message: "Followed successfully", isFollowed: true });
    }

    await Follow.findByIdAndDelete(isFollowed._id);

    return res
        .status(200)
        .json({ message: "Unfollowed successfully", isFollowed: false });
});

const getFollowedUser = asyncHandler(async (req, res) => {
    const followedUser = await Follow.aggregate([
        {
            $match: {
                follower: new mongoose.Types.ObjectId(req?.user?._id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "followedDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "followers",
                            localField: "_id",
                            foreignField: "following",
                            as: "followerToMyFollowing",
                        },
                    },
                    {
                        $addFields: {
                            isFollowing: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req?.user?._id,
                                            "$followerToMyFollowing.follower",
                                        ],
                                    },
                                    then: true,
                                    else: false,
                                },
                            },
                            noOfFollowersOfMyFollowing: {
                                $size: "$followerToMyFollowing",
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$followedDetails",
        },
        {
            $project: {
                _id: 0,
                followedDetails: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    isFollowing: 1,
                    noOfFollowersOfMyFollowing: 1,
                },
            },
        },
    ]);

    return res
        .status(200)
        .json({ message: "follwed list fetched successfully", followedUser });
});

const isFollowed = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const relation = await Follow.findOne({
        follower: req?.user?._id,
        following: userId,
    });

    if (relation) {
        return res.status(200).json({ message: "following", isFollowed: true });
    }

    return res
        .status(200)
        .json({ message: "not following", isFollowed: false });
});

export { toggleFollowing, getFollowedUser, isFollowed };
