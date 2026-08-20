import { useState } from "react";
import toast from "react-hot-toast";
import SignUpPresentation from "./SignupPresentation";
import { useDispatch } from "react-redux";
import { createAccount, login } from "../../Redux/Slices/AuthSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || "/products";

    const [signUpState, setSignUpState] = useState({
        firstName: '',
        email: '',
        mobileNumber: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleUserInput(e) {

        const { name, value } = e.target;

        setErrorMessage("");

        setSignUpState({
            ...signUpState,
            [name]: value
        });
    }

    async function handleFormSubmit(e) {

        e.preventDefault();

        // VALIDATIONS — kept in sync with the backend contract:
        // required: firstName, email, password (>= 6), mobileNumber

        if (
            !signUpState.email ||
            !signUpState.mobileNumber ||
            !signUpState.password ||
            !signUpState.firstName
        ) {

            toast.error("All fields are mandatory", { id: "register-error" });

            return;
        }

        if (
            !signUpState.email.includes('@') ||
            !signUpState.email.includes('.')
        ) {

            toast.error("Invalid email address", { id: "register-error" });

            return;
        }

        if (signUpState.password.length < 6) {

            toast.error("Password must be at least 6 characters", { id: "register-error" });

            return;
        }

        if (
            signUpState.mobileNumber.length < 10 ||
            signUpState.mobileNumber.length > 12
        ) {

            toast.error(
                "Mobile number should be between 10 and 12 digits",
                { id: "register-error" }
            );

            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {

            const apiResponse = await dispatch(
                createAccount(signUpState)
            ).unwrap();

            if (apiResponse?.success || apiResponse?.user) {

                // Auto-login right after a successful registration
                const loginResponse = await dispatch(login({
                    email: signUpState.email,
                    password: signUpState.password
                })).unwrap();

                if (loginResponse?.success) {
                    navigate(from, { replace: true });
                }
            }

        } catch (error) {

            // Backend message shown inline — e.g. "user with this email
            // already exists", "password must be at least 6 characters"
            setErrorMessage(error?.message || "Registration failed. Please try again.");

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SignUpPresentation
            handleFormSubmit={handleFormSubmit}
            handleUserInput={handleUserInput}
            signUpState={signUpState}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
        />
    );
}

export default Signup;