
import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import api from "../api"
import { Navigate } from "react-router-dom"

function Logout() {
  const { setUser } = useUser();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Error during logout API call:", error);
      } finally {
        localStorage.clear();
        setUser(null);
        setDone(true);
      }
    };

    performLogout();
  }, [setUser]);

  if (done) return <Navigate to="/Login" />;
  return null;
}

export default Logout