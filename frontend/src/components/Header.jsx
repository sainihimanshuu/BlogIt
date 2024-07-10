import { Link, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import UserIcon from "./UserIcon.jsx";
import { useDispatch, useSelector } from "react-redux";
import { storeLogout } from "../features/authSlice.js";
import axios from "axios";

export default function Header() {
    const loginStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        axios
            .post("/user/logOut", {
                accessToken: localStorage.getItem("token"),
            })
            .then((response) => {
                dispatch(storeLogout());
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })
            .catch((error) => console.log("error while logging out", error))
            .finally(() => navigate("/"));
    };

    return (
        <div className="p-6 h-20 flex justify-between items-center shadow-lg">
            <Link to="/">
                <img src="/blogit.png" className="w-20 ml-2" />
            </Link>
            <div className="flex justify-between items-center">
                <Button
                    className="myButton"
                    onClick={() => navigate("/getAllBlogs")}
                >
                    All Blogs
                </Button>
                {loginStatus ? (
                    <div className="flex items-center">
                        <Button className="myButton" onClick={handleLogout}>
                            Logout
                        </Button>
                        <UserIcon className="m-2" />
                    </div>
                ) : (
                    <div className="flex items-center">
                        <Button
                            className="myButton"
                            onClick={() => navigate("/signup")}
                        >
                            SignUp
                        </Button>
                        <Button
                            className="myButton"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
