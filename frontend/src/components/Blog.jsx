import parse from "html-react-parser";
import LikeIcon from "./LikeIcon.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import DeletePopup from "./DeletePopup.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Blog({ blogId }) {
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [blogDetails, setBlogDetails] = useState({});
    const [followed, setFollowed] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        axiosPrivate
            .get(`/blog/getBlog/${blogId}`)
            .then((response) => {
                setBlogDetails(response.data.blog);
                setLoading(false);
                setIsLiked(response.data.blog.isLiked);
                if (
                    response.data.blog.authorDetails._id ===
                    JSON.parse(localStorage.getItem("user"))._id
                ) {
                    setIsAuthor(true);
                }
                axiosPrivate
                    .get(
                        `/follow/isFollowed/${response.data.blog.authorDetails._id}`
                    )
                    .then((response) => {
                        setFollowed(response.data.isFollowed);
                    })
                    .catch((error) =>
                        console.log(
                            "error while fetching isFollowed from blog page ",
                            error
                        )
                    );
            })
            .catch((error) => console.log("error while fetching blog ", error));
    }, [isLiked, followed]); //dependency on isLiked to get on of likes updated

    const handleLikeToggle = async () => {
        axiosPrivate
            .post(`like/toggle/b/${blogDetails._id}`)
            .then((response) => setIsLiked(response.data.isLiked))
            .catch((error) =>
                console.log("error while toggeling like ", error)
            );
    };

    const deleteBlog = async () => {
        axiosPrivate
            .delete(`/blog/deleteBlog/${blogId}`)
            .then((response) => {
                console.log(response.data.message);
                navigate("/");
            })
            .catch((error) => console.log("error while deleting ", error));
    };

    const handleFollowToggle = () => {
        axiosPrivate
            .post(`/follow/toggleFollowing/${blogDetails?.authorDetails?._id}`)
            .then((response) => setFollowed(response.data.isFollowed))
            .catch((error) =>
                console.log("error while toggling follow ", error)
            );
    };

    return !loading ? (
        <div className="w-1/2 mx-auto mt-7">
            <h1 className="text-gray-700 text-6xl text-center font-bold">
                {blogDetails?.title}
            </h1>
            <div className="flex justify-between items-center mt-10">
                <div className="flex justify-start items-center">
                    <Link
                        to={`/accountProfile/${blogDetails?.authorDetails?._id}`}
                        className="clickableDiv"
                    >
                        <div className="flex justify-start items-center">
                            <img
                                className="rounded-full size-10 mr-5"
                                src={blogDetails?.authorDetails.avatar.url}
                                alt="author avatar"
                            />
                            <h3 className="text-gray-700 font-semibold mr-3">
                                {blogDetails?.authorDetails.username}
                            </h3>
                        </div>
                    </Link>
                    {!isAuthor && (
                        <Button
                            className="myButton"
                            onClick={handleFollowToggle}
                        >
                            {followed ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                </div>
                <div className="mr-1 flex" onClick={handleLikeToggle}>
                    <LikeIcon liked={isLiked} />
                    <p className="ml-2">{blogDetails?.noOfLikes}</p>
                </div>
            </div>
            <img
                className="w-full object-cover mt-10"
                src={blogDetails?.coverImage.url}
                alt="blog cover image"
            />
            <p className="mt-10 text-gray-600 text-lg mb-4">
                {parse(blogDetails?.content)}
            </p>
            {isAuthor && (
                <div className="flex justify-evenly">
                    <Button
                        className="myButton"
                        onClick={() => setDeletePopup(true)}
                    >
                        Delete
                    </Button>
                    <Button
                        className="myButton"
                        onClick={() => navigate(`/editBlog/${blogId}`)}
                    >
                        Edit
                    </Button>
                </div>
            )}
            {deletePopup && (
                <DeletePopup
                    onNoClick={() => setDeletePopup(false)}
                    deleteBlog={deleteBlog}
                />
            )}
        </div>
    ) : (
        <h1>Loading...</h1>
    );
}
