import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "./hooks/useAxiosPrivate.js";
import { storeLogin } from "./features/authSlice.js";

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            dispatch(storeLogin(localStorage.getItem("user")));
        }
        axiosPrivate
            .get("/user/getCurrentUser")
            .then((response) => dispatch(storeLogin(response.data.currentUser)))
            .catch((error) => console.log("user not logged in", error))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return !loading ? (
        <>
            <Header />
            <Outlet />
        </>
    ) : (
        <h1>Loading...</h1>
    );
}

export default App;
