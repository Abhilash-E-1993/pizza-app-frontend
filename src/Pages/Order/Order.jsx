import { useNavigate } from "react-router-dom";
import Layout from "../../Layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlaceOrder } from "../../Redux/Slices/OrderSlice";
import toast from "react-hot-toast";
import { clearCart, getCartDetails } from "../../Redux/Slices/CartSlice";

function Order(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cartsData} = useSelector((state) => state.cart);
    const cartItems = cartsData?.items || [];
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item?.quantity * item?.product?.price,
        0
    );

    const [details, setDetails] = useState({
        paymentMethod: 'CASH_ON_DELIVERY'
    });

    function handleUserInput(e) {
        const {name, value} = e.target;
        setDetails({
         ...details,
         [name]: value
        })
    }

    useEffect(()=>{
        dispatch(getCartDetails());
    },[dispatch]);

    async function handleFormSubmit(e) {
        e.preventDefault();

        if(cartItems.length === 0) {
            toast.error("Cart is empty");
            navigate("/products");
            return;
        }

        if(details.paymentMethod === '') {
            toast.error("Please select payment method");
            return;
        }

        const response = await dispatch(PlaceOrder({
            paymentMethod: details.paymentMethod
        }));
        console.log("order response", response);

        if(response?.payload?.success){
            await dispatch(clearCart());
            dispatch(getCartDetails());
            toast.success("placed the order successfully");
            navigate("/order/success");
        }else{
            toast.error("cannot placed the order");
        }
    }

    return(
       <Layout>
            <section className="text-gray-600 body-font min-h-56">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Thanks for Choosing Us {' '}</h1>

                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                            Total Price -
                            <span className="font-bold text-red-900">
                                ₹{totalPrice}
                            </span>
                        </p> 
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        <div className="relative flex-grow w-full">
                            <label htmlFor="paymentMethod" className="text-2xl leading-7 text-gray-600">
                                Payment Method
                            </label>
                            <select 
                                name="paymentMethod"
                                required
                                value={details.paymentMethod}
                                onChange={handleUserInput}
                                className="p-2 border rounded-md focus:outline-none focus:border-primary-500 bg-white text-gray-700 w-full"
                            >
                                <option value="CASH_ON_DELIVERY">Cash on delivery</option>
                                <option value="ONLINE">Online</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            className="mt-5 text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-primary-600 rounded text-lg"
                        >
                            Place Order
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}
export default Order;
