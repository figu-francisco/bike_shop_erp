import HomeCustomer from "../components/HomeCustomer"
import HomeStaff from "../components/HomeStaff"
import HomeShopManager from "../components/HomeShopManager"
import { useUser } from "../context/UserContext";
import { Navigate } from 'react-router-dom'


function Home() {

    const { user } = useUser();

    if (!user) {
        console.log("User is null, Logging out");
        return <Navigate to="/Logout" />;
    }

    switch (user.role) {
        case 'CUSTOMER':
            return <HomeCustomer />;

        case 'MECHANIC':
            return <HomeStaff />;

        case 'SHOP_MANAGER':
            return <HomeShopManager />;

        default:
            return <p>Unknown role: {user.role}</p>;
    }

}

export default Home;