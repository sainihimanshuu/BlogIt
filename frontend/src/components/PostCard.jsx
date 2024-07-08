import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PostCard({ blogId }) {
    const [blogDetails, setBlogDetails] = useEffect();

    useEffect(() => {
        axios
            .get(`/blog/getBlog/${blogId}`)
            .then((response) => setBlogDetails(response.data.blogs))
            .catch((error) =>
                console.log("error while fetching blog for postcard", error)
            );
    }, []);

    console.log("Hellog");
    return (
        <div>
            <Link to={`/blog/${blogId}`}>
                <img src={blogDetails?.coverImage.url} />
                <h1>{blogDetails?.title}</h1>
                <img src={blogDetails?.authorDetails.avatar.url} />
                <p>{blogDetails?.authorDetails.username}</p>
            </Link>
        </div>
    );
}
