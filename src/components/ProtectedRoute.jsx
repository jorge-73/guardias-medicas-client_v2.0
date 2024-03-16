import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <h1 className="text-center text-white mt-3">
        Loading...
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </h1>
    );
  if (!loading && !isAuthenticated) return <Navigate to={"/login"} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
