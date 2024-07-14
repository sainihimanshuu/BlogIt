import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import PostCard from "./PostCard.jsx";

export default function LikedBlogs() {
    const [likedBlogs, setLikedBlogs] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axiosPrivate
            .get("/like/getLikedBlogs")
            .then((response) => {
                setLikedBlogs(response.data.likedBlogs);
                // console.log(response.data);
            })
            .catch((error) =>
                console.log("error while fetching liked blogs ", error)
            );
    }, []);

    return (
        <div>
            <ul className="grid grid-cols-4">
                {likedBlogs.map((blog, index) => {
                    if (blog.blog) {
                        return (
                            <li key={index}>
                                <PostCard blogId={blog.blog} />
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
}
