import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import EditImage from "./EditImage.jsx";
import { useNavigate } from "react-router-dom";
import FormData from "form-data";

export default function EditProfile() {
    const [userDetails, setUserDetails] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const [choosenCover, setChoosenCover] = useState(null);
    const navigate = useNavigate();
    const inputDiv = useRef();

    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        axiosPrivate
            .get("user/getCurrentUser")
            .then((response) => setUserDetails(response.data.currentUser));
    }, []);

    useEffect(() => {
        if (userDetails) {
            setValue("username", userDetails?.username);
            setValue("about", userDetails?.about);
        }
    }, [userDetails, setValue]);

    const edit = (data) => {
        const form = new FormData();
        form.append("avatar", data.avatar);

        for (const key in data) {
            if (key !== "avatar") {
                form.append(key, data[key]);
            }
        }

        axiosPrivate
            .post(`/user/updateAccountDetails`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => navigate(`/accountProfile/${userDetails._id}`))
            .catch((error) =>
                console.log("error while updating profile", error)
            );
    };

    const handleChange = (event) => {
        setChoosenCover(URL.createObjectURL(event.target.files[0]));
        setValue("avatar", event.target.files[0]);
    };

    return (
        <div className="w-1/2 p-3 bg-gray-200 shadow-2xl rounded-[20px] my-7 mx-auto">
            <form onSubmit={handleSubmit(edit)}>
                <Input
                    label="Username"
                    type="text"
                    {...register("username")}
                    className="mt-1"
                />
                <div className="flex justify-center mb-2">
                    <EditImage
                        src={
                            choosenCover
                                ? choosenCover
                                : userDetails?.avatar?.url
                                  ? userDetails?.avatar?.url
                                  : "/no-profile-picture-15257.svg"
                        }
                        onClick={() => inputDiv.current.click()}
                        label="Avatar:"
                    />
                    <input
                        type="file"
                        className="hidden"
                        ref={inputDiv}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center justify-center mt-5">
                    <label
                        className="text-gray-800 font-semibold mr-2"
                        for="about"
                    >
                        About
                    </label>
                    <textarea
                        className="w-3/4 h-20 rounded-md pl-1"
                        id="about"
                        {...register("about")}
                    />
                </div>
                <div className="flex justify-evenly">
                    <Button className="myButton" type="submit">
                        Edit
                    </Button>
                    <Button
                        className="myButton"
                        onClick={() =>
                            navigate(`/accountProfile/${userDetails._id}`)
                        }
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
