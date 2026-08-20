import { useDispatch, useSelector } from "react-redux";
import Pizzalogo from "../assets/images/pizzaLogo.png";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/AuthSlice";
import { getCartDetails } from "../Redux/Slices/CartSlice";
import { useEffect, useState, useRef } from "react";

function Layout({ children }) {
    const { isLoggedIn, role, data } = useSelector((state) => state.auth);
    const { cartsData } = useSelector((state) => state.cart);
    const isAdmin = role?.toLowerCase() === "admin";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const firstName = data?.firstName || data?.userData?.firstName || "";
    const email = data?.email || data?.userData?.email || "";
    const initials = firstName ? firstName.charAt(0).toUpperCase() : "U";
    const cartCount = cartsData?.items?.length ?? 0;

    async function handleLogout(e) {
        e.preventDefault();
        setDropdownOpen(false);
        await dispatch(logout());
        navigate("/auth/login");
    }

    // Load the cart once the session is confirmed (badge count in the navbar).
    useEffect(() => {
        if (isLoggedIn) dispatch(getCartDetails());
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">

            <nav className="h-14 border-b border-gray-100 bg-white sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">

                    {/* Logo — always visible */}
                    <button
                        onClick={() => navigate(isLoggedIn ? "/products" : "/")}
                        className="flex items-center gap-2 text-gray-900 font-medium text-sm"
                    >
                        <img src={Pizzalogo} alt="Pizza App" className="h-7 w-7 object-contain" />
                        PIZZAHUB
                    </button>

                    {/* Right side — menu links only render for logged-in users */}
                    <div className="flex items-center gap-1">

                        {isLoggedIn && (
                            <>
                                <Link
                                    to="/products"
                                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Menu
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin/addproduct"
                                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <Link
                                    to="/cart"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="text-xs bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="w-px h-4 bg-gray-200 mx-1" />
                            </>
                        )}

                        {isLoggedIn ? (
                            /* Avatar + dropdown */
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen((o) => !o)}
                                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                                        {initials}
                                    </div>
                                    <span className="text-sm text-gray-700 hidden sm:block">{firstName || "Account"}</span>
                                    <svg
                                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-sm z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-xs font-medium text-gray-900">{firstName || "Account"}</p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/orders"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                                            >
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                My orders
                                            </Link>


                                            {isAdmin && (
                                                <Link
                                                    to="/admin/addproduct"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Admin panel
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-50 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition text-left"
                                            >
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/auth/login"
                                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default Layout;

