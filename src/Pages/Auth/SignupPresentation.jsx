import { Link } from "react-router-dom";
import Pizzalogo from "../../assets/Images/pizzaLogo.png";

function SignUpPresentation({ handleUserInput, handleFormSubmit }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-10">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-gray-100 mb-4">
                        <img src={Pizzalogo} alt="PizzaHub" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-900">Create an account</h1>
                    <p className="text-sm text-gray-400 mt-1">Join PizzaHub today</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                    <form onSubmit={handleFormSubmit} className="space-y-5">

                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1.5">
                                First name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                required
                                minLength={5}
                                placeholder="John"
                                onChange={handleUserInput}
                                className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition bg-white text-gray-900 placeholder-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="you@example.com"
                                onChange={handleUserInput}
                                className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition bg-white text-gray-900 placeholder-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-600 mb-1.5">
                                Mobile number
                            </label>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                required
                                maxLength={12}
                                placeholder="10-digit number"
                                onChange={handleUserInput}
                                className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition bg-white text-gray-900 placeholder-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                onChange={handleUserInput}
                                className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition bg-white text-gray-900 placeholder-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-700 active:scale-[0.98] transition-all"
                        >
                            Create account
                        </button>

                    </form>
                </div>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-300">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl px-7 py-4 text-center shadow-sm">
                    <p className="text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="text-gray-800 font-medium hover:text-gray-600 underline underline-offset-2 transition"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-300 mt-6">
                    © 2026 PizzaHub
                </p>

            </div>
        </div>
    );
}

export default SignUpPresentation;