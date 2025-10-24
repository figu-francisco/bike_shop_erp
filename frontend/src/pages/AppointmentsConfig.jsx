import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate, Link } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { jwtDecode } from 'jwt-decode'
import { useUser } from "../context/UserContext";
import { Spinner } from "@material-tailwind/react";
import ErrorPage from "../components/ErrorPage"







function AppointmentsConfig() {

    const { user } = useUser()
    const username = user.name
    const shopConfigId = user.assigned_shop.appointment_config
    const [shopConfig, setShopConfig] = useState([])

    useEffect(() => {
    
            getShopConfig();
    
        }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        // Call api to submit appointment config
    }

    const getShopConfig = () => {
        api
            .get(`/shop/config/${shopConfigId}/`)
            .then((res) => res.data)
            .then((data) => setShopConfig(data))
            .catch((err) => alert(err));
    };


    return (<div>
        <div>
            <h1>Home Shop Manager {username}</h1>
            <h1>assigned shop : {shopConfig.weekdays}</h1>
            {/*  <h1>id : {user_id}</h1>
            <h1>role : {user_role}</h1>
            */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Active days</label>
                </div>
                <div className="mt-2">
                    <input
                        id="weekdays"
                        name="weekdays"
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-danger sm:text-sm/6"
                        type="checkbox"
                        /* value={} */
                        /* onChange={(e) => setName(e.target.value)} */
                        placeholder="What should we call you?"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email Address</label>
                <div className="mt-2">
                    <input
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-light-grey focus:outline-2 focus:-outline-offset-2 focus:outline-danger sm:text-sm/6"
                        id="email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        /* value={email} */
                        /* onChange={(e) => setEmail(e.target.value)} */
                        placeholder="Email"
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-danger sm:text-sm/6"
                        type="password"
                        /* value={password} */
                        /* onChange={(e) => setPassword(e.target.value)} */
                        placeholder="Password"
                    />
                </div>
            </div>
        </form>
    </div>)
}

export default AppointmentsConfig