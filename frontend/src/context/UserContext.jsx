import { createContext, useContext, useState, useEffect } from 'react';
import { ACCESS_TOKEN } from "../constants"
import api from "../api"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            //setTimeout(() => setLoading(false), 1000);
            api.get("/accounts/me/")
                .then(res => setUser(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);