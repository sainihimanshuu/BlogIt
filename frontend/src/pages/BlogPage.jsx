import { useLoaderData } from "react-router-dom";
import Blog from "../components/Blog.jsx";

export default function BlogPage() {
    const response = useLoaderData();

    return (
        <div>
            <Blog blogDetails={response.data.blog} />
        </div>
    );
}
