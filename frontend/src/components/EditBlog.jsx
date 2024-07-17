import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import RTE from "./RTE.jsx";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import FormData from "form-data";
import { useNavigate } from "react-router-dom";
import EditImage from "./EditImage.jsx";

export default function EditBlog({ blogId }) {
    const [blogDetails, setBlogDetails] = useState(null);
    const [choosenCover, setChoosenCover] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const inputDiv = useRef();

    const { register, handleSubmit, control, setValue, getValues } = useForm();

    useEffect(() => {
        axiosPrivate
            .get(`/blog/getBlog/${blogId}`)
            .then((response) => {
                setBlogDetails(response.data.blog);
            })
            .catch((error) =>
                console.log("error while fetching blog for edit ", error)
            );
    }, [blogId]);

    useEffect(() => {
        if (blogDetails) {
            setValue("title", blogDetails.title);
            setValue("content", blogDetails.content);
        }
    }, [blogDetails, setValue]);

    const create = (data) => {
        const form = new FormData();
        form.append("coverImage", data.coverImage);

        for (const key in data) {
            if (key !== "coverImage") {
                form.append(key, data[key]);
            }
        }

        axiosPrivate
            .post(`/blog/editBlog/${blogId}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => navigate(`/blog/${blogId}`))
            .catch((error) => console.log("error while updating blog", error));
    };

    const handleChange = (event) => {
        setChoosenCover(URL.createObjectURL(event.target.files[0]));
        setValue("coverImage", event.target.files[0]);
    };

    return (
        <div className="w-1/2 p-3 bg-gray-200 shadow-2xl rounded-[20px] my-7 mx-auto">
            <form onSubmit={handleSubmit(create)}>
                <Input
                    label="Title: "
                    type="text"
                    {...register("title")}
                    className="mt-1"
                />
                <div className="flex justify-center mb-2 rounded-lg">
                    <EditImage
                        className="size-52 w-96"
                        src={
                            choosenCover
                                ? choosenCover
                                : blogDetails?.coverImage?.url
                                  ? blogDetails?.coverImage?.url
                                  : "/noThumbnail.jpg"
                        }
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
                        initialValue={getValues("content")}
                        label="Content:"
                    />
                </div>
                <div className="flex justify-evenly">
                    <Button className="myButton" type="submit">
                        Edit
                    </Button>
                    <Button
                        className="myButton"
                        onClick={() => navigate(`/blog/${blogId}`)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
