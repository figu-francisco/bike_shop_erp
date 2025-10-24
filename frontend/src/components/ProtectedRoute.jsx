import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

/* Function that checks if the user is authorized, if ok it returns whatever content was passed as parameter. Being authorized in this context means being authenticated. Permissions to pages based on role are checked on each page using UserProvider.*/

function ProtectedRoute({children}){

    const [isAuthorized, setIsAuthorized] = useState(null)
    
    // auth() returns a promise. 
    // If the promise is rejected the block catch() calls the function setIsAuthorized(false)
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const res = await api.post("/accounts/token/refresh", {
                refresh: refreshToken
            });
            if(res.status ===200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }else{
                setIsAuthorized(false)
            }
        }catch(error){
            console.log(error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        // If token expired calls refresh token function
        if(tokenExpiration < now){
            await refreshToken()
        }else{
            setIsAuthorized(true)
        }

    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }
    return isAuthorized ?  children : <Navigate to="/login" />
}

export default ProtectedRoute