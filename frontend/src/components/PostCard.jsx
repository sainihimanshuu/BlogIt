import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostCard(props) {
    const [blogDetails, setBlogDetails] = useState();

    useEffect(() => {
        axios
            .get(`/blog/getBlog/${props.blogId}`)
            .then((response) => setBlogDetails(response.data.blog))
            .catch((error) =>
                console.log("error while fetching for postcard", error)
            );
    }, []);

    return (
        <div>
            <Link to={`/blog/${props.blogId}`}>
                <img
                    src={
                        blogDetails?.coverImage?.url
                            ? blogDetails?.coverImage?.url
                            : "/blogit.png"
                    }
                />
                <h1>{blogDetails?.title}</h1>
                <img src={blogDetails?.authorDetails?.avatar?.url} />
                <p>{blogDetails?.authorDetails?.username}</p>
            </Link>
            hello
        </div>
    );
}
