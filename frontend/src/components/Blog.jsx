import parse from "html-react-parser";

export default function Blog({ blogDetails }) {
    return (
        <div className="w-1/2 mx-auto mt-7">
            <h1 className="text-gray-700 text-6xl text-center font-bold">
                {blogDetails.title}
            </h1>
            <div className="flex justify-start items-center mt-10">
                <img
                    className="rounded-full size-10 mr-5"
                    src={blogDetails.authorDetails.avatar.url}
                    alt="author avatar"
                />
                <h3 className="text-gray-700 font-semibold">
                    {blogDetails.authorDetails.username}
                </h3>
            </div>
            <img
                className="w-full object-cover mt-10"
                src={blogDetails.coverImage.url}
                alt="blog cover image"
            />
            <p className="mt-10">{parse(blogDetails.content)}</p>
        </div>
    );
}
