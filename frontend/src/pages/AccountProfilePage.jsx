import AccountProfile from "../components/AccountProfile.jsx";
import { useParams } from "react-router-dom";

export default function AccountProfilePage() {
    const { userId } = useParams();

    return (
        <div>
            <AccountProfile userId={userId} />
        </div>
    );
}
