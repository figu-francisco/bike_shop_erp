import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate, Link } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { jwtDecode } from 'jwt-decode'
import { useUser } from "../context/UserContext"
import { useDelay } from "../context/DelayContext"
import { Spinner } from "@material-tailwind/react"
import ErrorPage from "../components/ErrorPage"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import 'react-phone-number-input/style.css'



function PasswordReset() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [errorMessageLogin, setErrorMessageLogin] = useState("")
    const [errorMessagePassword, setErrorMessagePassword] = useState("")
    const [errorMessagePasswordConfirm, setErrorMessagePasswordConfirm] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [countryISOCodes, setCountryISOCodes] = useState([])
    const { delay } = useDelay(); // DelayProvider

    const page_name = "Reset Password"



    useEffect(() => {



    }, []);

    const handleAuth = async (userPassword) => {
        setLoading(true);

        try {
            // Simulate network delay 1000ms
            await delay(1000);
            // Loging in as dev: const email and pass won't be set, then we use default userEmail and userPassword
            const res = await api.post("", {
                id: userId,
                password: userPassword
            });


            navigate("/home")

        } catch (error) {
            if (
                error.response.data.detail ||
                error.response.data.password_confirm ||
                error.response.data.password 
            ) {
                if (error.response.data.detail) {
                    setErrorMessageLogin(error.response.data.detail)
                }
                if (error.response.data.password_confirm) {
                    setErrorMessagePasswordConfirm(error.response.data.password_confirm)
                }
                if (error.response.data.password) {
                    setErrorMessagePassword(error.response.data.password)
                }
            } else (
                setErrorMessage("An error has ocurred. Please try again later.")
            )
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setErrorMessageLogin("");
        setErrorMessagePhoneNumber("");

        handleAuth(password, passwordConfirm);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-background flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl/9 font-bold text-secondary">{page_name}</h2>
            </div>
            
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {/* Error Login message */}
                    {errorMessageLogin && (
                        <p className="text-danger">{errorMessageLogin}</p>
                    )}

                    {/* Error Password message */}
                    {errorMessagePassword && (
                        <ul className="text-danger">
                            {errorMessagePassword.map((msg) => (
                                <li>{msg}</li>
                            ))}
                        </ul>
                    )}



                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password_confirm" className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password_confirm"
                                name="password_confirm"
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-danger sm:text-sm/6"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    {/* Error Password Confirm message */}
                    {errorMessagePasswordConfirm && <p className="text-danger">{errorMessagePasswordConfirm}</p>}

                    {/* Error generic message */}
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}

                    <div>
                        <button disabled={loading} className="disabled:bg-primary/50 flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                            {loading ? <Spinner className="h-5 w-5 animate-spin" /> :
                                page_name
                            }
                        </button>
                    </div>
                </form>


                <div>
                    <p className="mt-10 text-center text-sm/6 text-mid-grey">
                        New here?
                        <Link disabled={loading} className="font-semibold text-danger/75 hover:text-danger" to={loading ? '#' : '/register_customer'} > create an account</Link>
                    </p>
                    <p className="text-center text-sm/6 text-mid-grey">
                I remember my password now! go to
                <Link className="font-semibold text-danger/75 hover:text-danger" to='/login'> Login</Link>
            </p>
                </div>


            </div>
        </div>
    );
}

export default PasswordReset