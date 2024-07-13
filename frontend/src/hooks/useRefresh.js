import axios from "../axios/api.js";

const useRefresh = () => {
    const refresh = async () => {
        const response = await axios.get("/user/refreshToken", {
            withCredentials: true,
        });

        // console.log(`old ${localStorage.getItem("token")}`);

        localStorage.setItem(
            "token",
            JSON.stringify(response.data.accessToken)
        );

        // console.log(`new ${localStorage.getItem("token")}`);
        return response.data.accessToken;
    };

    return refresh;
};

export default useRefresh;
