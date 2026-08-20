import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addProductToCart } from "../Redux/Slices/CartSlice";
import { formatPrice, getOptimizedImage } from "../Helpers/formatters";

// Memoized so a quantity change on one card doesn't re-render the whole grid.
const ProductCard = memo(function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);

    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    function updateQuantity(delta) {
        setQuantity((q) => Math.max(1, q + delta));
    }

    async function handleAddToCart(e) {
        e.preventDefault();

        if (!isLoggedIn) {
            toast.error("Please login to add items to cart", { id: "auth-error" });
            navigate("/auth/login", { state: { from: "/products" } });
            return;
        }

        setIsAdding(true);
        try {
            // API increments by 1 per call — add the chosen quantity.
            for (let i = 0; i < quantity; i++) {
                const response = await dispatch(addProductToCart(product._id));
                // Thunk already toasted the backend reason — stay quiet here.
                if (!response?.payload?.success) return;
            }
            // Cart state is updated from each API response — no refetch needed.
            toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart`, {
                id: `add-${product._id}`,
            });
            setQuantity(1);
        } finally {
            setIsAdding(false);
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition overflow-hidden">
            <Link to={`/products/${product._id}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                        src={getOptimizedImage(product.image, 500)}
                        alt={product.productName}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-2 left-2 bg-white text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-100">
                        {product.category}
                    </span>
                </div>
                <div className="p-4">
                    <h2 className="text-sm font-semibold text-gray-900 truncate">
                        {product.productName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>
            </Link>

            <div className="px-4 pb-4 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">
                    {formatPrice(product.price)}
                </span>

                <div className="flex items-center gap-2">
                    {/* Qty */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={(e) => { e.preventDefault(); updateQuantity(-1); }}
                            disabled={isAdding}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-40"
                        >
                            −
                        </button>
                        <span className="w-8 text-center text-sm text-gray-800">
                            {quantity}
                        </span>
                        <button
                            onClick={(e) => { e.preventDefault(); updateQuantity(1); }}
                            disabled={isAdding}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-40"
                        >
                            +
                        </button>
                    </div>

                    {/* Add — disabled while the request is in flight */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isAdding ? "Adding…" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;