import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../api"
import { useUser } from "../context/UserContext";

function HomeShopManager() {
    const [assigned_repairs, setAssignedRepairs] = useState([]);
    const [finished_repairs, setFinishedRepairs] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const { user } = useUser();
    /* const [name, setName] = useState("");
    const [assigned_shop, setAssignedShop] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState(""); */

    useEffect(() => {
       /* setName(user.name);
       setAssignedShop(user.assigned_shop);
       setId(user.id);
       setRole(user.role); */
    }, [])

    useEffect(() => {
        //getFinishedRepairs();
    }, [])

    const getAssignedRepairs = () => {
        api
            .get("/repairs/repairs/")
            .then((res) => res.data)
            .then((data) => { setAssignedRepairs(data); console.log(data) })
            .catch((err) => alert(err));
    };

    const getFinishedRepairs = () => {
        api
            .get("/repairs/finished_repairs/")
            .then((res) => res.data)
            .then((data) => { setFinishedRepairs(data); console.log(data) })
            .catch((err) => alert(err));
    };

    return (
        <div>
            <div>
                <Link to="/logout">Logout</Link>
                <h1>Home Shop Manager {user.name}</h1>
                <h1>id : {user.id}</h1>
                <h1>role : {user.role}</h1>
                <h1>assigned shop : {user.assigned_shop.name}</h1>
                <Link to="/appointments_config">Appointment config</Link>
            </div>
        </div>



    )
}
export default HomeShopManager