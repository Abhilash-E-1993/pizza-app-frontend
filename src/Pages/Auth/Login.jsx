import { useState } from "react";
import { login } from "../../Redux/Slices/AuthSlice";
import { getCartDetails } from "../../Redux/Slices/CartSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import LoginPresentation from "./LoginPresentation";
import { useNavigate } from "react-router-dom";

function Login() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    function handleUserInput(e) {

        const { name, value } = e.target;

        setLoginData({
            ...loginData,
            [name]: value
        });
    }

    async function handleFormSubmit(e) {

        e.preventDefault();

        // VALIDATIONS

        if (!loginData.email || !loginData.password) {

            toast.error("All fields are mandatory");

            return;
        }

        // EMAIL VALIDATION

        if (
            !loginData.email.includes('@') ||
            !loginData.email.includes('.')
        ) {

            toast.error("Invalid email address");

            return;
        }

        try {

            const apiResponse = await dispatch(
                login(loginData)
            ).unwrap();

            console.log("LOGIN RESPONSE", apiResponse);

            // SUCCESS

            if (apiResponse?.success) {

                toast.success(
                    apiResponse?.message
                );

                // LOAD CART AFTER LOGIN
                await dispatch(getCartDetails()).unwrap().catch(() => {
                    // ignore cart fetch failure here; Layout will handle auth state cleanup if needed
                });

                // SMALL DELAY FOR STATE UPDATE
                setTimeout(() => {
                    navigate("/");
                }, 500);
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error?.message || "Login failed"
            );
        }
    }

    return (
        <LoginPresentation
            handleFormSubmit={handleFormSubmit}
            handleUserInput={handleUserInput}
        />
    );
}

export default Login;