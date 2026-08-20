import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../Layouts/Layout";
import { cancelOrder, getAllOrders } from "../../Redux/Slices/OrderSlice";
import {
    formatDate,
    formatPaymentMethod,
    formatPrice,
    getOrderStatus,
} from "../../Helpers/formatters";

function OrderSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse space-y-3">
            <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
            </div>
            <div className="h-3 bg-gray-100 rounded w-48" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
    );
}

function Orders() {
    const dispatch = useDispatch();
    const { ordersdata, ordersLoading, ordersLoaded } = useSelector((state) => state.order);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (!ordersLoaded) dispatch(getAllOrders());
    }, [dispatch, ordersLoaded]);

    async function handleCancel(orderId) {
        if (cancellingId) return;
        setCancellingId(orderId);
        try {
            await dispatch(cancelOrder(orderId));
        } finally {
            setCancellingId(null);
        }
    }

    const showSkeletons = ordersLoading && !ordersLoaded;
    const orders = ordersdata || [];

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto px-5">

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">My orders</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {orders.length} order{orders.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {showSkeletons ? (
                        <div className="space-y-4">
                            <OrderSkeleton />
                            <OrderSkeleton />
                            <OrderSkeleton />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const status = getOrderStatus(order?.status);
                                const canCancel =
                                    order?.status === "ORDERED" || order?.status === "PROCESSING";

                                return (
                                    <div
                                        key={order?._id}
                                        className="bg-white border border-gray-100 rounded-xl p-5"
                                    >
                                        {/* Header row */}
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    #{order?._id?.slice(-8)} · {formatDate(order?.createdAt)}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatPaymentMethod(order?.paymentMethod)}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs font-medium border rounded-full px-2.5 py-1 ${status.classes}`}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Items */}
                                        <div className="border-t border-gray-50 pt-3 space-y-1.5">
                                            {(order?.items || []).map((item, idx) => (
                                                <div
                                                    key={item?._id || idx}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-gray-600 truncate mr-2">
                                                        {item?.product?.productName || "Item unavailable"} × {item?.quantity}
                                                    </span>
                                                    <span className="text-gray-500 flex-shrink-0">
                                                        {item?.product
                                                            ? formatPrice(item.product.price * item.quantity)
                                                            : "—"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Address */}
                                        {order?.address && (
                                            <p className="text-xs text-gray-400 mt-3 line-clamp-2">
                                                Deliver to: {order.address}
                                            </p>
                                        )}

                                        {/* Footer row */}
                                        <div className="border-t border-gray-50 mt-4 pt-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatPrice(order?.TotalPrice)}
                                            </span>
                                            {canCancel && (
                                                <button
                                                    onClick={() => handleCancel(order._id)}
                                                    disabled={cancellingId === order._id}
                                                    className="text-xs font-medium text-red-500 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    {cancellingId === order._id ? "Cancelling…" : "Cancel order"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-3">🍕</p>
                            <p className="text-sm text-gray-400 mb-4">No orders yet</p>
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

export default Orders;

