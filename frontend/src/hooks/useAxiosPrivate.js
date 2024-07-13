import { useEffect } from "react";
import { axiosPrivate } from "../axios/api.js";
import useRefresh from "./useRefresh.js";

const useAxiosPrivate = () => {
    const refresh = useRefresh();

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            (request) => {
                if (!request.headers["Authorization"]) {
                    request.headers["Authorization"] =
                        `Bearer ${localStorage.getItem("token")}`;
                }
                return request;
            },
            (error) => {
                console.log("error while intersepting request", error);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest.sent) {
                    //console.log("hello interceptor");
                    prevRequest.sent = true;
                    //console.log("before refresh");
                    const newAccessToken = await refresh();
                    //console.log("after refresh");
                    prevRequest.headers["Authorization"] =
                        `Bearer ${newAccessToken}`;
                    return axiosPrivate.request(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        };
    }, [refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
