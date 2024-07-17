import { Link, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../axios/api.js";
import FormData from "form-data";
import EditImage from "./EditImage.jsx";
import { useState, useRef } from "react";

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024 * 1024 * 3;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const schema = z.object({
    username: z
        .string()
        .regex(/^[a-zA-Z ]+$/)
        .min(3, { message: "username must be at least 3 character " })
        .max(20, { message: "username can be max 20 character" })
        .trim(),
    email: z.string().email().trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    avatar: z
        .any()
        .refine(
            (file) => file || file[0].size <= MAX_UPLOAD_SIZE,
            "file size must be less than 3MB"
        )
        .refine(
            (file) => file || ACCEPTED_IMAGE_TYPES.includes(file[0].type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional(),
});

export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [choosenAvatar, setChoosenAvatar] = useState(null);
    const navigate = useNavigate();
    const inputDiv = useRef();

    const onSubmit = (data) => {
        const form = new FormData();
        form.append("avatar", data.avatar);

        for (const key in data) {
            if (key !== "avatar") {
                form.append(key, data[key]);
            }
        }

        axios
            .post("/user/createUser", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                navigate("/login");
            })
            .catch((error) => console.log("error while signing up", error));
    };

    const handleChange = (event) => {
        setChoosenAvatar(URL.createObjectURL(event.target.files[0]));
        setValue("avatar", event.target.files[0]);
    };

    return (
        <div className="bg-gray-200 shadow-2xl rounded-[20px] w-80 h-[40rem] mx-auto mt-16 mb-10 relative">
            <h2 className="text-gray-800 text-xl font-bold absolute inset-0 mt-6">
                Signup
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="absolute top-0 right-0 bottom-0 left-0 mt-16"
            >
                <div className="flex justify-center mb-2">
                    <EditImage
                        className="rounded-[999px] size-40"
                        src={
                            choosenAvatar
                                ? choosenAvatar
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
                <Input
                    className="mt-4"
                    placeHolder="username"
                    error={errors.username?.message}
                    {...register("username")}
                />
                <Input
                    placeHolder="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    placeHolder="password"
                    type="password"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Button className="myButton" type="submit">
                    Signup
                </Button>
                <h2 className="mt-3">Already have an account?</h2>
                <Link className="underline underline-offset-1" to="/login">
                    Log In
                </Link>
            </form>
        </div>
    );
}
