import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layouts/Layout";
import { getAllProducts } from "../../Redux/Slices/ProductSlice";
import { addProductToCart, getCartDetails } from "../../Redux/Slices/CartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const productsData = useSelector((state) => state.product?.productsData ?? []);

    const [quantities, setQuantities] = useState({});
    const [loadingProducts, setLoadingProducts] = useState({});
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const categories = ["All", ...new Set(productsData.map((p) => p.category))];

    const filtered = productsData.filter(
        (p) => p.inStock && (activeCategory === "All" || p.category === activeCategory)
    );

    const updateQuantity = (productId, newQuantity) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: newQuantity > 0 ? newQuantity : 1,
        }));
    };

    const handleAddToCart = async (productId, e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error("Please login to add items to cart");
            navigate("/auth/login");
            return;
        }
        const quantity = quantities[productId] || 1;
        setLoadingProducts((prev) => ({ ...prev, [productId]: true }));
        try {
            for (let i = 0; i < quantity; i++) {
                const response = await dispatch(addProductToCart(productId));
                if (!response?.payload?.success) throw new Error();
            }
            await dispatch(getCartDetails());
            toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart`);
            setQuantities((prev) => ({ ...prev, [productId]: 1 }));
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="px-5 mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Menu</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
                        </p>
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 flex-wrap mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm border transition
                                    ${activeCategory === cat
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition overflow-hidden"
                                >
                                    <Link to={`/products/${item._id}`}>
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                            <span className="absolute bottom-2 left-2 bg-white text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-100">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h2 className="text-sm font-semibold text-gray-900 truncate">
                                                {item.productName}
                                            </h2>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="px-4 pb-4 flex items-center justify-between">
                                        <span className="text-base font-semibold text-gray-900">
                                            ₹{item.price}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {/* Qty */}
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); updateQuantity(item._id, (quantities[item._id] || 1) - 1); }}
                                                    className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-sm text-gray-800">
                                                    {quantities[item._id] || 1}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); updateQuantity(item._id, (quantities[item._id] || 1) + 1); }}
                                                    className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Add */}
                                            <button
                                                onClick={(e) => handleAddToCart(item._id, e)}
                                                disabled={loadingProducts[item._id]}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                {loadingProducts[item._id] ? "Adding…" : "Add"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-16">
                            Nothing available in this category right now.
                        </p>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export default Products;