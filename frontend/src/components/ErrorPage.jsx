import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

export default function ErrorPage() {
  const location = useLocation();
  const message = location.state?.message || "Something went wrong."

  const navigate = useNavigate();
  const onRetry = () => {
    navigate("/login");
  };


  return (
    <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-100 text-red-700 shadow-sm">
      
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
