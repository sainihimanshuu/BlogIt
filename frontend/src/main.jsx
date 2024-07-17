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
import {
    LoginPage,
    SignupPage,
    HomePage,
    CreateBlogPage,
    AccountProfilePage,
    BlogPage,
    AllBlogsPage,
    LikedBlogsPage,
    EditBlogPage,
    EditProfilePage,
    FollowedUserPage,
} from "./pages/index.js";

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
            />
            <Route path="/blog/:blogId" element={<BlogPage />} />
            <Route path="/likedBlogs" element={<LikedBlogsPage />} />
            <Route path="/getAllBlogs" element={<AllBlogsPage />} />
            <Route path="/editBlog/:blogId" element={<EditBlogPage />} />
            <Route path="/editProfile" element={<EditProfilePage />} />
            <Route path="/followedUsers" element={<FollowedUserPage />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
