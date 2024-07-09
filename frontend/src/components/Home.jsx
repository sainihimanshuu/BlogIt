import { useSelector } from "react-redux";
import Button from "./Button.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const loginStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const handleCreate = () => {
        if (!loginStatus) {
            navigate("/signup");
        } else {
            navigate("/createBlog");
        }
    };

    return (
        <div>
            <div>
                <h2 className="text-gray-800 text-3xl font-semibold font mt-20 mb-5">
                    Publish your own blogs easily
                </h2>
                <h3 className="text-gray-800 text-xl font-semibold font mb-3">
                    Just BlogIt !
                </h3>
            </div>
            <Button className="myButton" onClick={handleCreate}>
                Create
            </Button>
        </div>
    );
}
