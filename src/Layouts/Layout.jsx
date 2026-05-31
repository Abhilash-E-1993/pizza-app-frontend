import { useDispatch, useSelector } from "react-redux";
import Pizzalogo from "../assets/images/pizzaLogo.png";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/AuthSlice";
import {getCartDetails} from "../Redux/Slices/CartSlice"
import { useEffect } from "react";

function Layout({children}){
    const { isLoggedIn, role } = useSelector((state)=>state.auth);
    const {cartsData}=useSelector((state)=>state.cart);
    const isAdmin = role?.toLowerCase() === 'admin';
    console.log(isLoggedIn, role);
    const dispatch=useDispatch();
    const navigate=useNavigate()

    async function handleLogout(e){
        e.preventDefault();
        dispatch(logout())

    }
    async function fetchCartDetails(){
        const response=await dispatch(getCartDetails());
        console.log("useEffect response",response);
        if(response?.payload?.isUnauthorized){
            dispatch(logout());
        }
    }
    useEffect(()=>{
        if(isLoggedIn){
             fetchCartDetails();
        }
       
    },[]);

    return(
        <div>
        <nav className="flex items-center justify-around h-16 text-[#6B7280] font-mono border-none shadow-md">
            <div className="flex items-center justify-center" onClick={()=>navigate('/')}>
                 <p>Pizza App</p>
                <img src={Pizzalogo} alt="Pizza logo" />
            </div>

            <div className="hidden md:block">
                <div className='hidden md:block'>
                    <ul className='flex gap-4'>

                        <li className='hover:text-[#FF9110]'>
                            <Link to={'/products'}>Menu</Link>
                        </li>

                    </ul>
                </div>

            </div>

            <div>
                <ul className="flex gap-4">
                    <li className="hover:text-[#FF9110]">
                        {isLoggedIn ? (
                            <Link onClick={handleLogout}>Logout</Link>
                        ) : (
                            <Link to={'/auth/login'}>LogIn</Link>
                        )}
                    </li>

                    {isLoggedIn && isAdmin && (
                        <li className="hover:text-[#FF9110]">
                            <Link to={'/admin/addproduct'}>Admin</Link>
                        </li>
                    )}

                    {isLoggedIn && (
                        <Link to={'/cart'}>
                            <li>
                                <span className="text-lg" aria-hidden="true">🛒</span>
                                {' '}
                                <p className="text-black inline">{cartsData?.items?.length}</p>
                            </li>

                        </Link>
                    )

                    }
                </ul>
            </div>

        </nav>
            {children}

        <Footer />
        </div>
    )
}
export default Layout;
