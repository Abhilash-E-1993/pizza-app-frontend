import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartDetails, removeProductFromCart } from "../../Redux/Slices/CartSlice";
import Layout from "../../Layouts/Layout";
import { Link } from "react-router-dom";

function CartDetails() {
    const { cartsData } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const cartItems = cartsData?.items || [];
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item?.quantity * item?.product?.price, 0
    );

    async function handleRemove(productId) {
        await dispatch(removeProductFromCart(productId));
        dispatch(getCartDetails());
    }

    useEffect(() => {
        dispatch(getCartDetails());
    }, [dispatch]);

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-5">

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Cart</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                            {/* Items */}
                            <div className="lg:col-span-2 space-y-3">
                                {cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
                                    >
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item?.product?.image}
                                                alt={item?.product?.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/products/${item?.product?._id}`}
                                                className="text-sm font-medium text-gray-900 hover:underline truncate block"
                                            >
                                                {item?.product?.productName}
                                            </Link>
                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                {item?.product?.description}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                ₹{item?.product?.price} × {item?.quantity}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-sm font-medium text-gray-900">
                                                ₹{item?.product?.price * item?.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleRemove(item?.product?._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                aria-label="Remove item"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mt-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Continue shopping
                                </Link>
                            </div>

                            {/* Summary */}
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

                                <Link
                                    to="/order"
                                    className="block w-full text-center py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                                >
                                    Proceed to checkout
                                </Link>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-sm mb-4">Your cart is empty</p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Browse menu
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export default CartDetails;