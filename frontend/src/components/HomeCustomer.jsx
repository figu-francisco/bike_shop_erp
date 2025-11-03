import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import CustomDatePicker from "./CustomDatePicker";
import { useUser } from "../context/UserContext";




function HomeCustomer() {
    const [finished_repairs, setFinishedRepairs] = useState([]);
    const [date, setDate] = useState("");
    const { user } = useUser();
    const [shopsNamesAndConfig, setShopsNamesAndConfig] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [loading, setLoading] = useState(true)
    //const [error, setError] = useState("");
    //const [selectedShopAppointmentConfig, setSelectedShopAppointmentConfig] = useState(null);

    useEffect(() => {
    
        
        //getFinishedRepairs();
        //getShopsAvailableForAppointment();

        setLoading(false);
    }, [])

    const handleAppointmentConfirmation = () => {
        try {
            const appointmentData = {
                customer: user.id,
                shop: selectedShop.id,
                appointment_datetime: new Date(date).toISOString() // Convert to ISO string for backend
            };
            console.log("Submitting appointment data: ", appointmentData);
            api.post("/appointments/create/", appointmentData)
                .then((res) => {
                    setDate("");
                    setSelectedShop(null);
                    setShowSuccessPopup(true);
                })
                .catch((err) => {
                    console.error("Error creating appointment: ", err);
                    alert("Failed to create appointment. Please try again.");
                });
        } catch (error) {
            console.error("Unexpected error: ", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }

    const getFinishedRepairs = () => {
        // Simulate network delay 1000ms
        setTimeout(() => setLoading(false), 1000);
        api
            .get("/repairs/finished_repairs_customer/")
            .then((res) => res.data)
            .then((data) => { setFinishedRepairs(data); console.log(data) })
            .catch((err) => { alert(err); });
    };

    // Fetch shops (name + id + appointment_config) available for appointments
    // This is used to populate the dropdown for shop selection
    // and to pass the selected shop's appointment config to the CustomDatePicker
    const getShopsAvailableForAppointment = () => {
        api
            .get("/shop/available_for_appointment/")
            .then((res) => res.data)
            .then((data) => {
                setShopsNamesAndConfig(data); data.forEach(shop => console.log(
                    "shop : " + shop.name +
                    " id : " + shop.id +
                    " config : " + shop.appointment_config.weekdays
                ))
            })
            .catch((err) => { alert(err); });
    };

    function handleShopSelection(e) {
        //const data = JSON.parse(e.target.value);
        const shop_id = Number(e.target.value);
        const shop = shopsNamesAndConfig.find(s => s.id === shop_id);
        setSelectedShop(shop);
        console.log("Selected shop: ", shop);
        //setSelectedShopAppointmentConfig(e.appointment_config);
        //setSelectedShopAppointmentConfigId(data.shop_config_id);
    }

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (<div className="flex flex-col items-center gap-3">
        <Link to="/logout">Logout</Link>
        <h1>Hello {user.name}</h1>
        <h2>Appointments</h2>

       {/*  <h2>Finished Repairs</h2>
        {finished_repairs.map((repair) => (
            <div key={repair.id} className="order">
                <h3>{repair.reference}</h3>
                <p>Shop : {repair.shop.name}</p>
                <p>Regitered on : {new Date(repair.registered_at).toDateString()}</p>
            </div>
        ))} */}
        <h2>Pick your next appointment</h2>
        {/* <select onChange={handleShopSelection}
            value={selectedShop ? selectedShop.id : ""}
            >
            <option value="">-- Select a shop --</option>
            {shopsNamesAndConfig.map((shop) => (
                <option key={shop.id} value={shop.id}>
                    {shop.name}
                </option>
            ))}
        </select> */}
       {/*  {selectedShop && (
            <CustomDatePicker
                key={selectedShop.id}
                value={date}
                onChange={setDate}
                selectedShop={selectedShop}
            />
        )} */}

        {/* {date && selectedShop && (
            <div>
                <p> Your are about to take an appointment on {date.toString()} at {selectedShop.name}</p>
                <button
                    onClick={handleAppointmentConfirmation}
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                    Confirm
                </button>
            </div>
        )} */}

        {/* {showSuccessPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                    <h2 className="text-lg font-semibold mb-4">✅ Appointment Created</h2>
                    <p className="mb-6">Your appointment has been booked successfully.</p>
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={() => setShowSuccessPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )} */}
    </div>)
}
export default HomeCustomer