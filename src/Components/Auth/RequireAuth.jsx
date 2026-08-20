import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ requiredRole }) {
    const { isLoggedIn, role, authChecked } = useSelector((state) => state.auth);
    const location = useLocation();

    // App.jsx already blocks rendering until the session check resolves —
    // this is just a safety net so a protected page can never flash.
    if (!authChecked) {
        return null;
    }

    if (!isLoggedIn) {
        // Remember where the user wanted to go so login can send them back.
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location.pathname + location.search }}
                replace
            />
        );
    }

    if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
        return <Navigate to="/denied" replace />;
    }

    return <Outlet />;
}

export default RequireAuth;