import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate, Link } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { jwtDecode } from 'jwt-decode'
import { useUser } from "../context/UserContext"
import { useDelay } from "../context/DelayContext"
import { Spinner } from "@material-tailwind/react"
import Input from "./Input"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import 'react-phone-number-input/style.css'



function LoginRegisterForm({ route, method }) {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [errorMessageLogin, setErrorMessageLogin] = useState("")
    const [errorMessageEmail, setErrorMessageEmail] = useState("")
    const [errorMessagePassword, setErrorMessagePassword] = useState("")
    const [errorMessagePasswordConfirm, setErrorMessagePasswordConfirm] = useState("")
    const [errorMessagePhoneNumber, setErrorMessagePhoneNumber] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [countryISOCodes, setCountryISOCodes] = useState([])
    const { delay } = useDelay(); // DelayProvider
    const { user, setUser } = useUser(); // UserProvider

    const page_name = method === "login" ? "Login to Bike Repair Service" : "Register as a customer"

    useEffect(() => {

        if (method === "register") {
            //getISOCountryCodes();
        }

    }, []);


    const getISOCountryCodes = () => {
        setLoading(true);

        api
            .get("utils/iso_country_codes/")
            .then((res) => res.data)
            .then((data) => setCountryISOCodes(data))
            .catch((err) => setErrorMessage(err));

        setLoading(false);
    }

    const handleAuth = async (userEmail, userPassword) => {
        setLoading(true);

        try {
            // Simulate network delay 1000ms
            await delay(1000);
            // Loging in as dev: const email and pass won't be set, then we use default userEmail and userPassword
            const res = await api.post(route, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                password: userPassword,
                passwordConfirm: passwordConfirm
            });

            if (method === "login") {
                const access_token = res.data.access;
                localStorage.setItem(ACCESS_TOKEN, access_token);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                const me = await api.get("/accounts/me/");
                setUser(me.data);
                console.log("API login form, logging in as " + me.data.name)

                navigate("/home");

            } else {
                navigate("/login")
            }
        } catch (error) {
            if (
                error.response.data.detail ||
                error.response.data.email ||
                error.response.data.password_confirm ||
                error.response.data.password ||
                //error.responde.data.phone_number ||
                !isValidPhoneNumber(phoneNumber)
            ) {
                if (error.response.data.detail) {
                    setErrorMessageLogin(error.response.data.detail)
                }
                if (error.response.data.email) {
                    setErrorMessageEmail(error.response.data.email)
                }
                if (error.response.data.password_confirm) {
                    setErrorMessagePasswordConfirm(error.response.data.password_confirm)
                }
                if (error.response.data.password) {
                    setErrorMessagePassword(error.response.data.password)
                }
                /* if (!isValidPhoneNumber(phoneNumber)) {
                    setErrorMessagePhoneNumber("Please use correct phone number format: +32 470 12 34 56")
                } */
                if (error.response.data.phone_number) {
                    setErrorMessagePhoneNumber(error.response.data.phone_number)
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
        setErrorMessageEmail("");
        setErrorMessagePhoneNumber("");

        handleAuth(email, password, passwordConfirm, name, phoneNumber);
    }

    const handleDevLogin = (e, devEmail, devPass) => {
        e.preventDefault();
        setEmail(devEmail);
        setPassword(devPass);
        handleAuth(devEmail, devPass);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const my_countries = countryISOCodes.map(country => country.code);
    console.log(Array.isArray(my_countries));
    //const countries = getCountries().filter(c => countryISOCodes.includes(c));


    console.log(typeof my_countries)
    console.log(my_countries)

    return (
        <div className="bg-background flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl/9 font-bold text-secondary">{page_name}</h2>
            </div>
            {method === "register" && (
                <p className="text-center text-sm/6 text-mid-grey">
                    I already have an account, go to
                    <Link className="font-semibold text-danger/75 hover:text-danger" to='/login'> Login</Link>
                </p>
            )}
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {method === "register" && (
                        <div>
                            <Input
                                label="First Name"
                                id="first_name"
                                name="First Name"
                                required={true}
                                value={firstName}
                                onChange={setFirstName}
                                placeholder="Your first name?"
                            />
                            <Input
                                label="Last Name"
                                id="last_name"
                                name="Last Name"
                                required={true}
                                value={lastName}
                                onChange={setLastName}
                                placeholder="Your last name?"
                            />
                        </div>
                    )}
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

                    {/* Error Email unique message */}
                    {errorMessageEmail && <p className="text-danger">{errorMessageEmail}</p>}

                    {/* {method === "register" && (
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Phone Number</label>
                            </div>
                            <div className="mt-2">
                                {my_countries.length > 0 && (
                                    <PhoneInput
                                        defaultCountry="BE"
                                        countries={my_countries}
                                        international
                                        id="phone"
                                        name="phone"
                                        required
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-danger sm:text-sm/6"
                                        //type="text"
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                        placeholder="So we can contact you if needed"
                                        countryCallingCodeEditable={false}
                                    />
                                )}
                            </div>
                        </div>
                    )} */}
                    {method === "register" && (
                        <div className="mt-2">
                            <Input
                                label="Phone Number"
                                id="phone_number"
                                name="phoneNumber"
                                type="phone"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                placeholder="So we can contact you if needed"
                                required={true}
                            />
                        </div>
                    )}

                    {/* Error Phone Number message */}
                    {errorMessagePhoneNumber && <p className="text-danger">{errorMessagePhoneNumber}</p>}

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            {method === "login" && (
                                <div className="text-sm">
                                    <a href="/password_reset_request" className="font-semibold text-primary hover:text-danger">Forgot password?</a>
                                </div>
                            )}
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

                    {method === "register" && (
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
                    )}

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
                {method === "login" && (
                    <div>
                        <p className="mt-10 text-center text-sm/6 text-mid-grey">
                            New here?
                            <Link disabled={loading} className="font-semibold text-danger/75 hover:text-danger" to={loading ? '#' : '/register_customer'} > create an account</Link>
                        </p>
                        <p className="my-5 text-center text-2xl/9 font-bold text-secondary">Dev Login :</p>
                        <div className="flex flex-col gap-3">
                            <div>
                                <form onSubmit={(e) => handleDevLogin(e, "mechanic_a@test.dev", "Password1,")}>
                                    <button className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                                        Mechanic A
                                    </button>
                                </form>
                            </div>
                            <div>
                                <form onSubmit={(e) => handleDevLogin(e, "mechanic_b@test.dev", "Password1,")}>
                                    <button className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                                        Mechanic B
                                    </button>
                                </form>
                            </div>
                            <div>
                                <form onSubmit={(e) => handleDevLogin(e, "customer_a@test.dev", "Password1,")}>
                                    <button className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                                        Customer A
                                    </button>
                                </form>
                            </div>
                            <div>
                                <form onSubmit={(e) => handleDevLogin(e, "shop_manager_a@test.dev", "Password1,")}>
                                    <button className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                                        Shop Manager A
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginRegisterForm