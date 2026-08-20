import { useNavigate } from "react-router-dom";
import Layout from "../../Layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlaceOrder } from "../../Redux/Slices/OrderSlice";
import toast from "react-hot-toast";
import { emptyCartLocal, getCartDetails } from "../../Redux/Slices/CartSlice";
import { formatPrice } from "../../Helpers/formatters";

function Order() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartsData } = useSelector((state) => state.cart);
    const cartItems = cartsData?.items || [];

    const totalPrice = cartItems.reduce(
        (acc, item) =>
            item?.product ? acc + item.quantity * item.product.price : acc,
        0
    );

    const [details, setDetails] = useState({ paymentMethod: "CASH_ON_DELIVERY", address: "" });
    const [isPlacing, setIsPlacing] = useState(false);

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
            toast.error("Cart is empty", { id: "place-order-error" });
            navigate("/products");
            return;
        }

        // Address is optional — if given, the backend requires >= 10 chars.
        const address = details.address.trim();
        if (address && address.length < 10) {
            toast.error("Address should be at least 10 characters", { id: "place-order-error" });
            return;
        }

        setIsPlacing(true);
        try {
            const body = { paymentMethod: details.paymentMethod };
            if (address) body.address = address; // otherwise profile address is used

            const response = await dispatch(PlaceOrder(body));
            if (response?.payload?.success) {
                // Backend already cleared the cart server-side — mirror locally.
                dispatch(emptyCartLocal());
                toast.success("Order placed successfully", { id: "order-success" });
                navigate("/order/success");
            }
            // On failure the thunk already toasted the backend message.
        } finally {
            setIsPlacing(false);
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

                    {cartItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-3">🛒</p>
                            <p className="text-sm text-gray-400 mb-4">Your cart is empty</p>
                            <button
                                onClick={() => navigate("/products")}
                                className="text-sm font-medium text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Browse menu
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                            {/* Payment + address form */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-100 rounded-xl p-6">
                                    <p className="text-sm font-medium text-gray-900 mb-4">Payment method</p>
                                    <form onSubmit={handleFormSubmit} className="space-y-3" id="checkout-form">
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
                                    </form>
                                </div>


                                <div className="bg-white border border-gray-100 rounded-xl p-6">
                                    <p className="text-sm font-medium text-gray-900 mb-1">Delivery address</p>
                                    <p className="text-xs text-gray-400 mb-4">
                                        Optional — leave blank to use the address on your profile.
                                    </p>
                                    <textarea
                                        name="address"
                                        rows={3}
                                        value={details.address}
                                        onChange={handleUserInput}
                                        placeholder="House / street / area / city (min 10 characters)"
                                        form="checkout-form"
                                        className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition bg-white text-gray-900 placeholder-gray-300 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isPlacing}
                                    className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPlacing && (
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    )}
                                    {isPlacing ? "Placing order…" : "Place order"}
                                </button>
                            </div>

                            {/* Order summary */}
                            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
                                <p className="text-sm font-medium text-gray-900">Order summary</p>
                                <div className="space-y-2">
                                    {cartItems
                                        .filter((item) => item?.product)
                                        .map((item) => (
                                            <div key={item?._id || item.product._id} className="flex justify-between text-sm text-gray-500">
                                                <span className="truncate mr-2">{item.product.productName} × {item.quantity}</span>
                                                <span className="flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">Total</span>
                                    <span className="text-base font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export default Order;

