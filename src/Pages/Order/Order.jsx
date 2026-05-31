import { useNavigate } from "react-router-dom";
import Layout from "../../Layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlaceOrder } from "../../Redux/Slices/OrderSlice";
import toast from "react-hot-toast";
import { clearCart, getCartDetails } from "../../Redux/Slices/CartSlice";

function Order() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartsData } = useSelector((state) => state.cart);
    const cartItems = cartsData?.items || [];
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item?.quantity * item?.product?.price, 0
    );

    const [details, setDetails] = useState({ paymentMethod: "CASH_ON_DELIVERY" });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value });
    }

    useEffect(() => {
        dispatch(getCartDetails());
    }, [dispatch]);

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            navigate("/products");
            return;
        }
        const response = await dispatch(PlaceOrder({ paymentMethod: details.paymentMethod }));
        if (response?.payload?.success) {
            await dispatch(clearCart());
            dispatch(getCartDetails());
            toast.success("Order placed successfully");
            navigate("/order/success");
        } else {
            toast.error("Could not place order");
        }
    }

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-5">

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        {/* Payment form */}
                        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6">
                            <p className="text-sm font-medium text-gray-900 mb-4">Payment method</p>
                            <form onSubmit={handleFormSubmit} className="space-y-3">
                                {[
                                    { value: "CASH_ON_DELIVERY", label: "Cash on delivery", sub: "Pay when your order arrives" },
                                    { value: "ONLINE", label: "Online payment", sub: "UPI, card, or net banking" },
                                ].map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${
                                            details.paymentMethod === opt.value
                                                ? "border-gray-900 bg-gray-50"
                                                : "border-gray-100 hover:border-gray-200"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={opt.value}
                                            checked={details.paymentMethod === opt.value}
                                            onChange={handleUserInput}
                                            className="accent-gray-900"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                                        </div>
                                    </label>
                                ))}

                                <button
                                    type="submit"
                                    className="w-full mt-2 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                                >
                                    Place order
                                </button>
                            </form>
                        </div>

                        {/* Order summary */}
                        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
                            <p className="text-sm font-medium text-gray-900">Order summary</p>
                            <div className="space-y-2">
                                {cartItems.map((item) => (
                                    <div key={item?.product?._id} className="flex justify-between text-sm text-gray-500">
                                        <span className="truncate mr-2">{item?.product?.productName} × {item?.quantity}</span>
                                        <span className="flex-shrink-0">₹{item?.product?.price * item?.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">Total</span>
                                <span className="text-base font-semibold text-gray-900">₹{totalPrice}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default Order;