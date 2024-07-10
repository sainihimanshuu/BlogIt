import PostCard from "./PostCard.jsx";

export default function AccountProfile({ accountDetails: { accountBlogs } }) {
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
