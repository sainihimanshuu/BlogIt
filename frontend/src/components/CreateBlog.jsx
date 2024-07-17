import RTE from "./RTE.jsx";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { useNavigate } from "react-router-dom";
import FormData from "form-data";
import EditImage from "./EditImage.jsx";
import { useState, useRef } from "react";

export default function CreateBlog() {
    const { register, handleSubmit, control } = useForm();
    const [choosenCover, setChoosenCover] = useState(null);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const inputDiv = useRef();

    const create = (data) => {
        const form = new FormData();
        form.append("coverImage", data.coverImage[0]);

        for (const key in data) {
            if (key !== "coverImage") {
                form.append(key, data[key]);
            }
        }

        axiosPrivate
            .post("/blog/createBlog", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Post created");
                console.log(response.data);
                navigate("/");
            })
            .catch((error) => console.log("error while creating post", error));
    };

    const handleChange = (event) => {
        setChoosenCover(URL.createObjectURL(event.target.files[0]));
        setValue("coverImage", event.target.files[0]);
    };

    return (
        <div className="w-1/2 p-3 bg-gray-200 shadow-2xl rounded-[20px] my-7 mx-auto">
            <form onSubmit={handleSubmit(create)}>
                <Input label="Title: " type="text" {...register("title")} />
                <div className="flex justify-center mb-2 rounded-lg">
                    <EditImage
                        className="size-52 w-96"
                        src={choosenCover ? choosenCover : "/noThumbnail.jpg"}
                        onClick={() => inputDiv.current.click()}
                        label="Cover Image:"
                    />
                    <input
                        type="file"
                        className="hidden"
                        ref={inputDiv}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <RTE
                        control={control}
                        name="content"
                        initialValue=""
                        label="Content:"
                    />
                </div>
                <Button className="myButton" type="submit">
                    Create
                </Button>
            </form>
        </div>
    );
}
