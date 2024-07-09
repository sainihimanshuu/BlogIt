import PostCard from "./PostCard.jsx";

export default function AccountProfile({ accountDetails: { accountBlogs } }) {
    return (
        <div>
            <div>
                <img
                    src={
                        accountBlogs.avatar?.url
                            ? accountBlogs.avatar?.url
                            : `/no-profile-picture-15257.svg`
                    }
                />
                <h1>{accountBlogs.username}</h1>
                <p>{accountBlogs.about && accountBlogs.about}</p>
            </div>
            <div>
                <ul>
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
