import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../axios/api.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { storeLogin } from "../features/authSlice.js";

const schema = z.object({
    email: z.string().email().trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [isValidCredientials, setIsValideCredentials] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        axios
            .post("/user/loginUser", data, {
                withCredentials: true,
            })
            .then((response) => {
                dispatch(storeLogin(response.data.user));
                localStorage.setItem(
                    "token",
                    String(response.data.accessToken)
                );
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                navigate("/");
            })
            .catch((error) => {
                setIsValideCredentials(false);
                console.log(error);
            });
    };

    return (
        <div className="bg-gray-200 shadow-2xl rounded-[20px] w-80 h-[22rem] mx-auto mt-16 relative">
            {/* <div className="mt-0"> */}
            <h2 className="text-gray-800 text-xl font-bold absolute top-0 right-0 bottom-0 left-0 mt-6">
                Login
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="absolute top-0 right-0 bottom-0 left-0 mt-24"
            >
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
                    LogIn
                </Button>
            </form>
            {!isValidCredientials && (
                <span className="text-xs font-semibold text-red-500">
                    Invalid credentials
                </span>
            )}
            {/* </div> */}
        </div>
    );
}
