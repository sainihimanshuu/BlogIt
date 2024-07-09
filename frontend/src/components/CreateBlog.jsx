import RTE from "./RTE.jsx";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormData from "form-data";

export default function CreateBlog() {
    const { register, handleSubmit, control } = useForm();
    const navigate = useNavigate();

    const create = (data) => {
        const form = new FormData();
        form.append("coverImage", data.coverImage[0]);

        for (const key in data) {
            if (key !== "coverImage") {
                form.append(key, data[key]);
            }
        }

        axios
            .post("/blog/createBlog", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                console.log("Post created");
                console.log(response.data);
                navigate("/");
            })
            .catch((error) => console.log("error while creating post", error));
    };

    return (
        <div>
            <form onSubmit={handleSubmit(create)}>
                <Input label="Title" type="text" {...register("title")} />
                <RTE
                    control={control}
                    name="content"
                    initialValue=""
                    label="content"
                />
                <Input
                    type="file"
                    label="coverImage"
                    {...register("coverImage")}
                />
                <Button className="myButton" type="submit">
                    Create
                </Button>
            </form>
        </div>
    );
}
