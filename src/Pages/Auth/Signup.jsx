import { useState } from "react";
import toast from "react-hot-toast";
import SignUpPresentation from "./SignupPresentation";
import { useDispatch } from "react-redux";
import { createAccount, login } from "../../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

function Signup() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [signUpState, setSignUpState] = useState({
        firstName: '',
        email: '',
        mobileNumber: '',
        password: ''
    });

    function handleUserInput(e) {

        const { name, value } = e.target;

        setSignUpState({
            ...signUpState,
            [name]: value
        });
    }

    async function handleFormSubmit(e) {

        e.preventDefault();

        // VALIDATIONS

        if (
            !signUpState.email ||
            !signUpState.mobileNumber ||
            !signUpState.password ||
            !signUpState.firstName
        ) {

            toast.error("All fields are mandatory");

            return;
        }

        if (
            signUpState.firstName.length < 5 ||
            signUpState.firstName.length > 20
        ) {

            toast.error(
                "First name should be between 5 and 20 characters"
            );

            return;
        }

        if (
            !signUpState.email.includes('@') ||
            !signUpState.email.includes('.')
        ) {

            toast.error("Invalid email address");

            return;
        }

        if (
            signUpState.mobileNumber.length < 10 ||
            signUpState.mobileNumber.length > 12
        ) {

            toast.error(
                "Mobile number should be between 10 and 12 digits"
            );

            return;
        }

        try {

            const apiResponse = await dispatch(
                createAccount(signUpState)
            ).unwrap();

            console.log("SIGNUP RESPONSE", apiResponse);

            // SUCCESS - registration returns message + user, not a success field

            if (apiResponse?.message) {

                toast.success(
                    "Registration successful! Logging you in..."
                );

                const loginResponse = await dispatch(login({
                    email: signUpState.email,
                    password: signUpState.password
                })).unwrap();

                console.log("AUTO LOGIN RESPONSE", loginResponse);

                if (loginResponse?.success) {
                    navigate("/");
                }
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error?.message || "Registration failed"
            );
        }
    }

    return (
        <SignUpPresentation
            handleFormSubmit={handleFormSubmit}
            handleUserInput={handleUserInput}
        />
    );
}

export default Signup;