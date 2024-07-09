import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { storeLogin } from "../features/authSlice.js";
import Cookies from "js-cookie";

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
            .post("./user/loginUser", data)
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
        <div className="bg-gray-200 shadow-2xl mt-14 w-80 h-96 mx-auto rounded-[20px] flex items-center relative">
            {/* <div className="mt-0"> */}
            <h2 className="absolute font-bold text-2xl top-10 ml-auto">
                Login
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="absolute top-46">
                <Input
                    label="email"
                    className="mb-8 mt-20 h-7 p-2 rounded-md ml-0"
                    placeHolder="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    className="mb-12 h-7 p-2 rounded-md"
                    placeHolder="password"
                    type="password"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Button className="myButton" type="submit">
                    LogIn
                </Button>
            </form>
            {!isValidCredientials && <span>Invalid credentials</span>}
            {/* </div> */}
        </div>
    );
}
