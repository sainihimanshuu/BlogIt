import RTE from "./RTE.jsx";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
    const { register, handleSubmit, control } = useForm();
    const navigate = useNavigate();

    const create = (data) => {
        axios
            .post("/blog/createBlog", {
                ...data,
                author: localStorage.getItem("user")._id,
                accessToken: localStorage.getItem("token"),
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
