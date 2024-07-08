import parse from "html-react-parser";

export default function Blog({ blogDetails }) {
    return (
        <div>
            <img src={blogDetails.coverImage.url} alt="blog cover image" />
            <h1>{blogDetails.title}</h1>
            <img
                src={blogDetails.authorDetails.avatar.url}
                alt="author avatar"
            />
            <h3>{blogDetails.authorDetails.username}</h3>
            <p>{parse(blogDetails.content)}</p>
        </div>
    );
}
