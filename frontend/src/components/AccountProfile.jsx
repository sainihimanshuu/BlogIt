import PostCard from "./PostCard.jsx";
import Button from "./Button.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import axios from "../axios/api.js";

export default function AccountProfile({ userId }) {
    const [userDetails, setUserDetails] = useState({});
    const [isAuthor, setIsAuthor] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [noOfFollowers, setNoOfFollowers] = useState(0);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axios.get(`/user/accountProfile/${userId}`).then((response) => {
            setUserDetails(response.data.accountBlogs);
            console.log(response.data);
            setNoOfFollowers(response.data.noOfFollowers);
            if (
                response.data.accountBlogs._id ===
                JSON.parse(localStorage.getItem("user"))._id
            ) {
                setIsAuthor(true);
            }
            axiosPrivate
                .get(`/follow/isFollowed/${response.data.accountBlogs._id}`)
                .then((response) => {
                    setFollowed(response.data.isFollowed);
                })
                .catch((error) =>
                    console.log(
                        "error while fetching isFollowed from blog page ",
                        error
                    )
                );
        });
    }, [followed]);

    const handleFollowToggle = () => {
        axiosPrivate
            .post(`/follow/toggleFollowing/${userDetails._id}`)
            .then((response) => setFollowed(response.data.isFollowed))
            .catch((error) =>
                console.log("error while toggling follow ", error)
            );
    };

    return (
        <div className="flex">
            <div className="w-1/3 fixed">
                <div className="">
                    <img
                        className="rounded-[999px] size-60 p-7"
                        src={
                            userDetails.avatar?.url
                                ? userDetails.avatar?.url
                                : `/no-profile-picture-15257.svg`
                        }
                    />
                </div>
                <div className="ml-7 text-left">
                    <h1 className="text-gray-700 text-4xl font-bold">
                        {userDetails.username}
                    </h1>
                    <h1 className="mr-4 text-gray-500 text-lg font-semibold">{`${noOfFollowers} followers`}</h1>
                    <p className="mt-4 text-gray-500">
                        {userDetails.about && userDetails.about}
                    </p>
                </div>
                <div className="flex justify-start ml-4 mt-4">
                    {isAuthor ? (
                        <Button
                            className="myButton"
                            onClick={() => navigate(`/editProfile`)}
                        >
                            Edit
                        </Button>
                    ) : (
                        <Button
                            className="myButton"
                            onClick={handleFollowToggle}
                        >
                            {followed ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                </div>
            </div>
            <div className="w-2/3 h-screen ml-auto">
                <ul className=" grid grid-cols-3">
                    {userDetails?.blogs?.map((blog, index) => (
                        <li key={index}>
                            <PostCard blogId={blog._id} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
