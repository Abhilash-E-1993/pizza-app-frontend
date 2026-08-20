import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartDetails, removeProductFromCart } from "../../Redux/Slices/CartSlice";
import Layout from "../../Layouts/Layout";
import { Link } from "react-router-dom";
import { formatPrice, getOptimizedImage } from "../../Helpers/formatters";

function CartDetails() {
    const { cartsData } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [removingId, setRemovingId] = useState(null);

    const cartItems = cartsData?.items || [];

    // Items whose product was deleted (product === null) render as
    // "unavailable" and are excluded from every total.
    const totalPrice = cartItems.reduce(
        (acc, item) =>
            item?.product ? acc + item.quantity * item.product.price : acc,
        0
    );

    async function handleRemove(productId) {
        if (!productId || removingId) return;
        setRemovingId(productId);
        try {
            // Cart state updates from the API response — no refetch needed.
            await dispatch(removeProductFromCart(productId));
        } finally {
            setRemovingId(null);
        }
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

                                {cartItems.map((item) =>
                                    item?.product ? (
                                        <div
                                            key={item?._id || item.product._id}
                                            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={getOptimizedImage(item.product.image, 200)}
                                                    alt={item.product.productName}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/products/${item.product._id}`}
                                                    className="text-sm font-medium text-gray-900 hover:underline truncate block"
                                                >
                                                    {item.product.productName}
                                                </Link>
                                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                    {item.product.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatPrice(item.product.price)} × {item.quantity}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemove(item.product._id)}
                                                    disabled={removingId === item.product._id}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                                                    aria-label="Remove item"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Product was deleted from the store */
                                        <div
                                            key={item?._id || Math.random()}
                                            className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 flex items-center gap-4"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-xl">
                                                🍕
                                            </div>
                                            <p className="text-sm text-gray-400">Item unavailable</p>
                                        </div>
                                    )
                                )}

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
                            <p className="text-4xl mb-3">🛒</p>
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

