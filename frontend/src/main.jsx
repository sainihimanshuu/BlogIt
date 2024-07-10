import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from "react-router-dom";
import axios from "axios";
import {
    LoginPage,
    SignupPage,
    HomePage,
    CreateBlogPage,
    AccountProfilePage,
    BlogPage,
    AllBlogsPage,
} from "./pages/index.js";

axios.defaults.baseURL = "http://localhost:8000/api/v1";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/createBlog" element={<CreateBlogPage />} />
            <Route
                path="/accountProfile/:userId"
                element={<AccountProfilePage />}
                loader={async ({ params }) => {
                    try {
                        return await axios.get(
                            `/user/accountProfile/${params.userId}`
                        );
                    } catch (error) {
                        console.log(
                            "error while fetching accountProfile ",
                            error.response.data
                        );
                    }
                }}
            />
            <Route
                path="/blog/:blogId"
                element={<BlogPage />}
                loader={async ({ params }) => {
                    try {
                        return await axios.get(
                            `/blog/getBlog/${params.blogId}`
                        );
                    } catch (error) {
                        console.log(
                            "error with fetching blog ",
                            error.response.data
                        );
                    }
                }}
            />
            <Route path="/getAllBlogs" element={<AllBlogsPage />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
