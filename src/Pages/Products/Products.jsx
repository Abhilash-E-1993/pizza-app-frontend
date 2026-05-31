import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layouts/Layout";
import { getAllProducts } from "../../Redux/Slices/ProductSlice";
import { addProductToCart, getCartDetails } from "../../Redux/Slices/CartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Products(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const productsData = useSelector((state) => state.product?.productsData ?? []);

    const [quantities, setQuantities] = useState({});
    const [loadingProducts, setLoadingProducts] = useState({});

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const updateQuantity = (productId, newQuantity) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity > 0 ? newQuantity : 1
        }));
    };

    const handleAddToCart = async (productId, e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            toast.error("Please login to add product to cart");
            navigate('/auth/login');
            return;
        }

        const quantity = quantities[productId] || 1;

        if (quantity < 1) {
            toast.error("Please select at least 1 pizza");
            return;
        }

        setLoadingProducts(prev => ({ ...prev, [productId]: true }));

        try {
            for (let i = 0; i < quantity; i++) {
                const response = await dispatch(addProductToCart(productId));
                if (!response?.payload?.success) {
                    throw new Error("Failed to add product");
                }
            }
            await dispatch(getCartDetails());
            toast.success(`${quantity} pizza${quantity > 1 ? 's' : ''} added to cart`);
            setQuantities(prev => ({ ...prev, [productId]: 1 }));
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        }
    };

    return(
        <Layout>
            <section className="py-12 bg-gray-50">
                <div className="px-5 mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Menu</h1>
                        <p className="text-gray-600 text-lg">Select your favorite pizzas and enjoy!</p>
                    </div>

                    {productsData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productsData.map((item) => {
                                return item.inStock && (
                                    <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                                        <Link to={`/products/${item._id}`}>
                                            <div className="relative overflow-hidden h-56">
                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                />
                                                <span className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                    {item.category}
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                                                    {item.productName}
                                                </h2>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-yellow-500">
                                                        ₹{item.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="px-5 pb-5 border-t">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-sm font-medium text-gray-700">Qty:</span>
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            updateQuantity(item._id, (quantities[item._id] || 1) - 1);
                                                        }}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={quantities[item._id] || 1}
                                                        onChange={(e) => {
                                                            e.preventDefault();
                                                            const val = parseInt(e.target.value) || 1;
                                                            updateQuantity(item._id, val);
                                                        }}
                                                        className="w-12 text-center border-0 outline-none text-sm"
                                                        min="1"
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            updateQuantity(item._id, (quantities[item._id] || 1) + 1);
                                                        }}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => handleAddToCart(item._id, e)}
                                                disabled={loadingProducts[item._id]}
                                                className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {loadingProducts[item._id] ? "Adding..." : "Add to Cart"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No pizzas available right now</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default Products;
