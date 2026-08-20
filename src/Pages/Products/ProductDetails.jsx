import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productDetails } from "../../Redux/Slices/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layouts/Layout";
import { addProductToCart, removeProductFromCart } from "../../Redux/Slices/CartSlice";
import toast from "react-hot-toast";
import { formatPrice, getOptimizedImage } from "../../Helpers/formatters";

function ProductDeatils() {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { cartsData } = useSelector((state) => state.cart);
    const isInCart = cartsData?.items?.some((item) => item?.product?._id === productId);
    const cartItem = cartsData?.items?.find((item) => item?.product?._id === productId);

    const [productdetails, setproductDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    async function fetchProductDetails() {
        const details = await dispatch(productDetails(productId));
        setproductDetails(details?.payload?.data || null);
    }

    async function handleAddToCart() {
        if (!isLoggedIn) {
            toast.error("Please login to add product to cart", { id: "auth-error" });
            navigate('/auth/login', { state: { from: `/products/${productId}` } });
            return;
        }

        if (quantity < 1) {
            toast.error("Please select at least 1 item", { id: `add-${productId}` });
            return;
        }

        setIsLoading(true);
        try {
            for (let i = 0; i < quantity; i++) {
                const response = await dispatch(addProductToCart(productId));
                // Thunk already toasted the backend reason — stay quiet here.
                if (!response?.payload?.success) return;
            }
            // Cart state updates from the API response — no refetch needed.
            toast.success(`Added to cart`, { id: `add-${productId}` });
            setQuantity(1);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemove() {
        setIsRemoving(true);
        try {
            const response = await dispatch(removeProductFromCart(productId));
            if (response?.payload?.success) {
                toast.success("Removed from cart", { id: `remove-${productId}` });
            }
        } finally {
            setIsRemoving(false);
        }
    }

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

    useEffect(() => {
        fetchProductDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="px-5 mx-auto max-w-5xl">

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-6"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to menu
                    </Link>

                    {!productdetails ? (
                        /* Skeleton while details load */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-pulse">
                            <div className="bg-gray-100 rounded-xl h-72 w-full" />
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-100 rounded w-24" />
                                <div className="h-8 bg-gray-100 rounded w-2/3" />
                                <div className="h-3 bg-gray-100 rounded w-full" />
                                <div className="h-3 bg-gray-100 rounded w-5/6" />
                                <div className="h-7 bg-gray-100 rounded w-28" />
                                <div className="h-11 bg-gray-100 rounded w-full" />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                            {/* Product Image */}
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                                <img
                                    alt={productdetails?.productName || "Product"}
                                    className="w-full h-72 md:h-96 object-cover"
                                    loading="lazy"
                                    src={getOptimizedImage(productdetails?.image, 800)}
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <span className="inline-block w-fit text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 mb-3">
                                    {productdetails?.category}
                                </span>

                                <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                                    {productdetails?.productName}
                                </h1>

                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    {productdetails?.description}
                                </p>

                                <div className="text-2xl font-semibold text-gray-900 mb-8">
                                    {formatPrice(productdetails?.price)}
                                </div>



                                {isInCart ? (
                                    <div>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {cartItem?.quantity} item{cartItem?.quantity > 1 ? 's' : ''} in cart
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition"
                                                onClick={() => navigate('/cart')}
                                            >
                                                Go to cart
                                            </button>
                                            <button
                                                className="flex-1 px-6 py-3 text-sm font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleRemove}
                                                disabled={isRemoving}
                                            >
                                                {isRemoving ? "Removing…" : "Remove from cart"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                <button
                                                    onClick={decrementQuantity}
                                                    disabled={isLoading}
                                                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 text-lg disabled:opacity-40"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center text-sm text-gray-800">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={incrementQuantity}
                                                    disabled={isLoading}
                                                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 text-lg disabled:opacity-40"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            disabled={isLoading}
                                            className="w-full px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            onClick={handleAddToCart}
                                        >
                                            {isLoading && (
                                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            )}
                                            {isLoading ? "Adding…" : "Add to cart"}
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default ProductDeatils;
