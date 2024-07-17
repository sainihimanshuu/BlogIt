import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function FollowedUserList() {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axiosPrivate
            .get("/follow/getFollowedUsers")
            .then((response) => {
                setUserList(response.data.followedUser);
                setLoading(false);
            })
            .catch((error) =>
                console.log("error while fetching followed user list ", error)
            );
    }, []);

    return !loading ? (
        <div className="mt-4">
            {userList.map((user) => (
                <div className="p-2 w-1/2 mx-auto shadow-xl flex justify-between items-center">
                    <Link
                        to={`/accountProfile/${user?.followedDetails?._id}`}
                        className="clickableDiv"
                    >
                        <div className="flex justify-start items-center">
                            <img
                                className="rounded-full size-10 mr-5"
                                src={user?.followedDetails.avatar.url}
                                alt="author avatar"
                            />
                            <h3 className="text-gray-700 font-semibold mr-3">
                                {user?.followedDetails.username}
                            </h3>
                        </div>
                    </Link>
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-700 font-semibold mr-3">
                            {user?.followedDetails.noOfFollowersOfMyFollowing}{" "}
                            followers
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <h1>Loading...</h1>
    );
}
