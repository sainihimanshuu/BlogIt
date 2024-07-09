import { Link, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import FormData from "form-data";
import util from "util";

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
        .regex(/^[a-zA-Z_]+$/)
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
            (file) => ACCEPTED_IMAGE_TYPES.includes(file[0].type),
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

    const navigate = useNavigate();

    const onSubmit = (data) => {
        const form = new FormData();
        form.append("avatar", data.avatar[0]);

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

    return (
        <div className="bg-gray-200 shadow-2xl mt-14 w-80 h-96 mx-auto rounded-[20px] flex justify-center items-center">
            <div className="mt-0">
                <h2 className="font-bold text-2xl">Signup</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="file"
                        error={errors.avatar?.message}
                        {...register("avatar")}
                    />
                    <Input
                        className=""
                        placeHolder="username"
                        error={errors.username?.message}
                        {...register("username")}
                    />
                    <Input
                        className=""
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
                    <h2>Already have an account?</h2>
                    <Link to="/login">Log In</Link>
                </form>
            </div>
        </div>
    );
}
