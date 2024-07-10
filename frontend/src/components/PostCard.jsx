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
        <div className="bg-gray-200 shadow-2xl rounded-[20px] w-56 h-[15rem] mx-auto mt-7 relative">
            <Link to={`/blog/${props.blogId}`}>
                <img
                    className="h-1/2 w-full rounded-t-[20px] object-cover"
                    src={
                        blogDetails?.coverImage?.url
                            ? blogDetails?.coverImage?.url
                            : "/noThumbnail.jpg"
                    }
                />
                <h1 className="text-gray-700 text-lg font-semibold mt-2">
                    {blogDetails?.title}
                </h1>
                <div className="h-[32px] w-full flex justify-between items-center absolute bottom-0 mb-3">
                    <img
                        className="rounded-full size-8 ml-2"
                        src={
                            blogDetails?.authorDetails?.avatar?.url
                                ? blogDetails?.authorDetails?.avatar?.url
                                : "/noAvatar.png"
                        }
                    />
                    <p className="mr-2 text-gray-700 text-xs font-semibold">
                        {blogDetails?.authorDetails?.username}
                    </p>
                </div>
            </Link>
        </div>
    );
}
