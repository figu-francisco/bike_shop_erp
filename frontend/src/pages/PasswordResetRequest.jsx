import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate, Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useDelay } from "../context/DelayContext"
import { Spinner } from "@material-tailwind/react"
import 'react-phone-number-input/style.css'
import ErrorPage from "../components/ErrorPage"



function PasswordResetRequest() {

    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()
    const { delay } = useDelay(); // DelayProvider



    useEffect(() => {



    }, []);




    const send = async (userEmail) => {
        setLoading(true);

        try {
            // Simulate network delay 1000ms
            await delay(1000);

            const res = await api.post("/accounts/password_reset_request/", {
                email: userEmail
            });
            console.log(res.data.detail);
            setSuccess(res.data.detail);

        } catch (error) {
            //setErrorMessage("An error has ocurred. Please try again later.")
            navigate("/error",  { state: { message: "An error has ocurred while sending your password recovery request. Please try again later."}});

        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        send(email);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (success) {
        return <div>{success}</div>;
    }


    return (
        <div className="bg-background flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl/9 font-bold text-secondary">Password Recovery Page</h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <div>
                        <button disabled={loading} className="disabled:bg-primary/50 flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                            {loading ? <Spinner className="h-5 w-5 animate-spin" /> :
                                "Send"
                            }
                        </button>
                    </div>
                    <div>
                        <p className="text-center text-sm/6 text-mid-grey">
                            I already have an account, go to
                            <Link className="font-semibold text-danger/75 hover:text-danger" to='/login'> Login</Link>
                        </p>
                        <p className="text-center text-sm/6 text-mid-grey">
                            New here?
                            <Link disabled={loading} className="font-semibold text-danger/75 hover:text-danger" to={loading ? '#' : '/register_customer'} > create an account</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PasswordResetRequest