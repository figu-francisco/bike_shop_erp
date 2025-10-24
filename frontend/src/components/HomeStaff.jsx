import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../api"
import { useUser } from "../context/UserContext";

function HomeStaff() {
    const [assigned_repairs, setAssignedRepairs] = useState([]);
    const [finished_repairs, setFinishedRepairs] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const { username } = useUser();

    useEffect(() => {
        getAssignedRepairs();
    }, [])

    useEffect(() => {
        getFinishedRepairs();
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
                <h1>Home mechanic {username}</h1>
                <h2>Active Repairs</h2>
                {assigned_repairs.map((repair) => (
                     <div key={repair.id} className="order">
                        <h3>{repair.reference}</h3>
                        <p>Shop : {repair.shop.name}</p>
                        <p>Regitered on : {new Date(repair.registered_at).toDateString()}</p>
                    </div>
                ))}
                <h2>Finished Repairs</h2>
                {finished_repairs.map((repair) => (
                     <div key={repair.id} className="order">
                        <h3>{repair.reference}</h3>
                        <p>Shop : {repair.shop.name}</p>
                        <p>Regitered on : {new Date(repair.registered_at).toDateString()}</p>
                        <p>Finished on : {new Date(repair.completed_at).toDateString()}</p>
                    </div>
                ))}
            </div>
            <div className="bg-green-500 text-white p-4 rounded">
                If you see a red box, Tailwind is working!
            </div>
             </div>



            )
}
export default HomeStaff