import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
