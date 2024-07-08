import AccountProfile from "../components/AccountProfile.jsx";
import { useLoaderData } from "react-router-dom";

export default function AccountProfilePage() {
    const response = useLoaderData();

    return (
        <div>
            <AccountProfile accountDetails={response.data} />
        </div>
    );
}
