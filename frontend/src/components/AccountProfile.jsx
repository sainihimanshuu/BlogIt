import PostCard from "./PostCard.jsx";
import Button from "./Button.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountProfile({ accountDetails: { accountBlogs } }) {
    const [isAuthor, setIsAuthor] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (accountBlogs._id === JSON.parse(localStorage.getItem("user"))._id) {
            setIsAuthor(true);
        }
    }, []);

    return (
        <div className="flex">
            <div className="w-1/3 fixed">
                <div className="">
                    <img
                        className="rounded-full size-54 p-7"
                        src={
                            accountBlogs.avatar?.url
                                ? accountBlogs.avatar?.url
                                : `/no-profile-picture-15257.svg`
                        }
                    />
                </div>
                <div className="ml-7 text-left">
                    <h1 className="text-gray-700 text-4xl font-bold">
                        {accountBlogs.username}
                    </h1>
                    <p>{accountBlogs.about && accountBlogs.about}</p>
                </div>
                {isAuthor && (
                    <Button
                        className="myButton"
                        onClick={() => navigate(`/editProfile`)}
                    >
                        Edit Profile
                    </Button>
                )}
            </div>
            <div className="w-2/3 h-screen ml-auto">
                <ul className=" grid grid-cols-3">
                    {accountBlogs.blogs.map((blog, index) => (
                        <li key={index}>
                            <PostCard blogId={blog._id} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
