import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productDetails } from "../../Redux/Slices/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layouts/Layout";
import { addProductToCart, getCartDetails, removeProductFromCart } from "../../Redux/Slices/CartSlice";
import toast from "react-hot-toast";

function ProductDeatils(){
    const {productId}=useParams();
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { cartsData } = useSelector((state) => state.cart);
    const isInCart = cartsData?.items?.some((item) => item?.product?._id === productId);
    const cartItem = cartsData?.items?.find((item) => item?.product?._id === productId);

    const [productdetails, setproductDetails] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchProductDetails(){
        const details=await dispatch(productDetails(productId));
        setproductDetails(details?.payload?.data);
    }

    async function handleAddToCart() {
        if (!isLoggedIn) {
            toast.error("Please login to add product to cart");
            navigate('/auth/login');
            return;
        }

        if (quantity < 1) {
            toast.error("Please select at least 1 pizza");
            return;
        }

        setIsLoading(true);
        try {
            for (let i = 0; i < quantity; i++) {
                const response = await dispatch(addProductToCart(productId));
                if (!response?.payload?.success) {
                    throw new Error("Failed to add product");
                }
            }
            await dispatch(getCartDetails());
            toast.success(`Added to cart`);
            setQuantity(1);
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemove() {
        if (!isLoggedIn) {
            toast.error("Please login to remove product from cart");
            navigate('/auth/login');
            return;
        }

        const response=await dispatch(removeProductFromCart(productId));
        if(response?.payload?.success){
            dispatch(getCartDetails());
            toast.success("Removed from cart");
        }
    }

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

    useEffect(()=>{
        fetchProductDetails()
    },[productId]);

    useEffect(()=>{
        if(isLoggedIn){
            dispatch(getCartDetails());
        }
    },[dispatch, isLoggedIn]);


    return(
         <Layout>
        <section className="py-12 bg-gradient-to-r from-amber-50 to-orange-100">
          <div className="container px-5 mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

              {/* Product Image */}
              <div className="flex justify-center">
                <img
                  alt={productdetails?.productName}
                  className="w-full max-w-sm rounded-lg object-cover"
                  src={productdetails?.image}
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-3">
                  {productdetails?.category}
                </span>

                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {productdetails?.productName}
                </h1>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {productdetails?.description}
                </p>

                <div className="text-3xl font-bold text-yellow-600 mb-8">
                  ₹{productdetails?.price}
                </div>

                {isInCart ? (
                  <div>
                    <p className="text-gray-600 text-sm mb-4">
                      {cartItem?.quantity} pizza{cartItem?.quantity > 1 ? 's' : ''} in cart
                    </p>
                    <button
                      className="w-full px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition font-semibold"
                      onClick={handleRemove}
                    >
                      Remove from Cart
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={decrementQuantity}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-lg"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setQuantity(val > 0 ? val : 1);
                          }}
                          className="w-14 text-center border-0 outline-none text-lg"
                          min="1"
                        />
                        <button
                          onClick={incrementQuantity}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full px-6 py-3 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={handleAddToCart}
                    >
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      </Layout>
    )
}

export default ProductDeatils;
