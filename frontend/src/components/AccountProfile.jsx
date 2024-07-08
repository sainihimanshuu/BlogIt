import { useId } from "react";
import PostCard from "./PostCard.jsx";

export default function AccountProfile({ accountDetails: { accountBlogs } }) {
    const id = useId();

    return (
        <div>
            <div>
                <img
                    src={
                        // accountDetails.avatar?.url
                        //     ? accountDetails.avatar?.url
                        `/no-profile-picture-15257.svg`
                    }
                />
                <h1>{accountBlogs.username}</h1>
                <p>{accountBlogs.about && accountBlogs.about}</p>
            </div>
            <div>
                <ul>
                    {accountBlogs.blogs.map((blog) => (
                        <li id={id}>
                            <PostCard blogId={blog._id} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
