import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function Requireauth({ requiredRole }){
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const userRole = role?.toLowerCase();

    if (!isLoggedIn) {
        return <Navigate to={'/auth/login'} replace />;
    }

    if (requiredRole && userRole !== requiredRole.toLowerCase()) {
        return <Navigate to={'/denied'} replace />;
    }

    return <Outlet />;
}

export default Requireauth;
