import { useEffect, useState } from "react";
import axios from "../axios/api.js";
import PostCard from "./PostCard.jsx";

export default function AllBlogs() {
    const [loading, setLoading] = useState(true);
    const [allBlogsDetails, setAllBlogDetails] = useState([]);

    useEffect(() => {
        axios
            .get("/blog/getAllBlogs")
            .then((response) => {
                setAllBlogDetails([response.data.allBlogs]);
                console.log(allBlogsDetails);
                setLoading(false);
            })
            .catch((error) =>
                console.log("error fetching blogs for all blogs", error)
            );
    }, []);

    return !loading ? (
        <div>
            <ul className="grid grid-cols-4">
                {allBlogsDetails.map((blog, index) => (
                    <li key={index}>
                        <PostCard blogId={blog._id} />
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <h1>Loading...</h1>
    );
}
