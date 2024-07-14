import { useRef } from "react";
import Button from "./Button.jsx";

export default function DeletePopup({ onNoClick, deleteBlog }) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onNoClick();
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center"
            ref={modalRef}
            onClick={closeModal}
        >
            <div className="w-1/3 h-32 bg-gray-100 rounded-[15px] flex flex-col gap-6">
                <h1 className="text-gray-800 text-lg font-semibold mt-2">
                    Are you sure you want to delete the blog?
                </h1>
                <div className="flex justify-evenly ">
                    <Button className="myButton" onClick={deleteBlog}>
                        Yes
                    </Button>
                    <Button className="myButton" onClick={onNoClick}>
                        No
                    </Button>
                </div>
            </div>
        </div>
    );
}
