import { useParams } from "react-router-dom";
import EditBlog from "../components/EditBlog.jsx";

export default function EditBlogPage() {
    const { blogId } = useParams();

    return (
        <div>
            <EditBlog blogId={blogId} />
        </div>
    );
}
