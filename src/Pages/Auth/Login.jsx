import { useState } from "react";
import { login } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import LoginPresentation from "./LoginPresentation";
import { useLocation, useNavigate } from "react-router-dom";

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Where the user originally wanted to go (set by RequireAuth)
    const from = location.state?.from || "/products";

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleUserInput(e) {

        const { name, value } = e.target;

        setErrorMessage("");

        setLoginData({
            ...loginData,
            [name]: value
        });
    }

    async function handleFormSubmit(e) {

        e.preventDefault();

        // VALIDATIONS

        if (!loginData.email || !loginData.password) {

            toast.error("All fields are mandatory", { id: "auth-error" });

            return;
        }

        // EMAIL VALIDATION

        if (
            !loginData.email.includes('@') ||
            !loginData.email.includes('.')
        ) {

            toast.error("Invalid email address", { id: "auth-error" });

            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {

            const apiResponse = await dispatch(
                login(loginData)
            ).unwrap();

            // SUCCESS — state is already set by the slice; go back to where
            // the user was headed (or the menu). The cart is fetched by Layout.
            if (apiResponse?.success) {
                navigate(from, { replace: true });
            }

        } catch (error) {

            // Backend message shown inline ("Invalid credentials", etc.)
            setErrorMessage(error?.message || "Login failed. Please try again.");

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <LoginPresentation
            handleFormSubmit={handleFormSubmit}
            handleUserInput={handleUserInput}
            loginData={loginData}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
        />
    );
}

export default Login;