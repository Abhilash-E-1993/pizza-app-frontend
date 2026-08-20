import { Link } from "react-router-dom";
import Pizzalogo from "../../assets/images/pizzaLogo.png";

function LoginPresentation({ handleFormSubmit, handleUserInput, loginData, isSubmitting, errorMessage }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-gray-100 mb-4">
                        <img src={Pizzalogo} alt="PizzaHub" className="w-12 h-12 object-contain" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-400 mt-1">Sign in to PizzaHub</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                    <form onSubmit={handleFormSubmit} className="space-y-5">

                        {errorMessage && (
                            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                                {errorMessage}
                            </p>
                        )}

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
                                value={loginData.email}
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
                                value={loginData.password}
                                onChange={handleUserInput}
                                className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition bg-white text-gray-900 placeholder-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting && (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            )}
                            {isSubmitting ? "Signing in…" : "Sign in"}
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
                        Don&rsquo;t have an account?{" "}
                        <Link
                            to="/auth/signup"
                            className="text-gray-800 font-medium hover:text-gray-600 underline underline-offset-2 transition"
                        >
                            Create one
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

export default LoginPresentation;