import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import {
    deleteFromCloundinary,
    uploadOnCloundinary,
} from "../utils/cloudinary.js";
import Blog from "../models/blog.models.js";

const createBlogSchema = z.object({
    title: z.string().trim(),
    content: z.string().trim(),
});
//you need to be logged in to create a blog
const createBlog = asyncHandler(async (req, res) => {
    const validatedData = createBlogSchema.parse(req.body);

    let blogDetails = validatedData;
    if (req.file) {
        const coverImageLocalPath = req.file?.path;
        const uploadResponse = await uploadOnCloundinary(coverImageLocalPath);
        const coverImage = uploadResponse;
        blogDetails = {
            ...blogDetails,
            coverImage: {
                public_id: coverImage.public_id,
                url: coverImage.url,
            },
        };
    }

    blogDetails = {
        ...blogDetails,
        author: req.user._id,
    };

    const blog = await Blog.create(blogDetails);

    if (!blog) {
        throw new ApiError(500, "Failed to create blog, please try again");
    }

    return res.status(200).json({ message: "Blog created successfully", blog });
});

const editBlogSchema = z.object({
    title: z.string().trim().optional(),
    content: z.string().trim().optional(),
});
//you need to be logged in to edit a blog
const editBlog = asyncHandler(async (req, res) => {
    const validatedData = editBlogSchema.parse(req.body);
    const { id } = req.params;

    let blog = await Blog.findById(id);

    if (blog?.author.toString() !== req.user?._id.toString())
        throw new ApiError(400, "only the user can edit the blog");

    const fields = Object.keys(validatedData);
    fields.forEach(
        (field) => (blog._doc = { ...blog._doc, [field]: validatedData[field] })
    );

    if (req.file) {
        const oldCoverImage = blog.coverImage.public_id;
        const coverImageLocalPath = req.file?.path;
        const uploadResponse = await uploadOnCloundinary(coverImageLocalPath);
        const coverImage = uploadResponse;
        blog._doc = {
            ...blog._doc,
            coverImage: {
                public_id: coverImage.public_id,
                url: coverImage.url,
            },
        };
        await deleteFromCloundinary(oldCoverImage);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

    return res
        .status(200)
        .json({ message: "Blog edited successfully", updatedBlog });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(400, "No such blog exits");
    }

    if (blog?.author.toString() !== req.user?._id.toString())
        throw new ApiError(400, "only the user can delete the blog");

    await deleteFromCloundinary(blog.coverImage?.public_id);

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "blog deleted successfully" });
});

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(400, "No blog exists");
    }

    return res.status(200).json({ message: "Blog fetched successfully", blog });
});

export { createBlog, editBlog, deleteBlog, getBlog };
