import { useParams } from "react-router-dom";
import Blog from "../components/Blog.jsx";

export default function BlogPage() {
    let { blogId } = useParams();
    return (
        <div>
            <Blog blogId={blogId} />
        </div>
    );
}
