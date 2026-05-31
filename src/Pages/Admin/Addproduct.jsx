import Layout from "../../Layouts/Layout";
import Food from "../../assets/images/Food.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AddProducts, deleteProductById } from "../../Redux/Slices/AdminSlice";
import { getAllProducts } from "../../Redux/Slices/ProductSlice";
import toast from "react-hot-toast";

function Addproduct(){
    const dispatch = useDispatch();
    const productsData = useSelector((state) => state.product.productsData ?? []);
    const [addproduct, setaddProduct] = useState({
        productName: '',
        image: null,
        price: '',
        quantity: '',
        description: '',
        category: 'Veg',
        inStock: 'true'
    });

    function handleUserInput(e) {
       const { name, value, type, files } = e.target;
      
       if (type === 'file') {
           setaddProduct({
               ...addproduct,
               image: files[0] || null
           });
       } else {
           setaddProduct({
               ...addproduct,
               [name]: value
           });
       }
    }

    async function handleFormSubmit(e){
        e.preventDefault();
        const allowedCategories = ["Veg", "Non-Veg", "drinks", "sides"];
        // Validation
        if (!addproduct.productName || !addproduct.image || !addproduct.price || !addproduct.quantity || !addproduct.description) {
            toast.error("Missing value from the form");
            return;
        }
        if (addproduct.productName.length < 5) {
            toast.error("Product name must be at least 5 characters");
            return;
        }
        if (!addproduct.price) {
            toast.error("Product price is required");
            return;
        }
        if (!addproduct.image) {
            toast.error("Product image is required");
            return;
        }
        if (!addproduct.quantity) {
            toast.error("Product quantity is required");
            return;
        }
        if (addproduct.description.length < 5) {
            toast.error("Product description must be at least 5 characters");
            return;
        }
        if (!addproduct.category || !allowedCategories.includes(addproduct.category)) {
            toast.error("Please select a valid category");
            return;
        }

        const formData = new FormData();
        formData.append('productName', addproduct.productName);
        formData.append('image', addproduct.image);
        formData.append('price', addproduct.price);
        formData.append('quantity', addproduct.quantity);
        formData.append('description', addproduct.description);
        formData.append('category', addproduct.category);
        formData.append('inStock', addproduct.inStock);

        const apiResponse = await dispatch(AddProducts(formData));

        if (apiResponse?.meta?.requestStatus === 'fulfilled') {
            setaddProduct({
                productName: '',
                image: null,
                price: '',
                quantity: '',
                description: '',
                category: 'Veg',
                inStock: 'true'
            });
            e.target.reset();
            dispatch(getAllProducts());
        }
    }

    async function handleDeleteProduct(productId) {
        const response = await dispatch(deleteProductById(productId));
        if (response?.meta?.requestStatus === 'fulfilled') {
            dispatch(getAllProducts());
        }
    }

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    return(
        <Layout>
            <section className="py-12">
                <div  className="flex items-center justify-center px-5">
                    <div className="md:w-2/6">
                        <img src={Food} />
                    </div>

                    <div className="max-w-md md:w-4/6 mx-auto mt-8 bg-white p-4">
                        <h2 className="mb-4 text-2xl font-semibold">
                            Admin products
                        </h2>

                        <form onSubmit={handleFormSubmit}>
                        {/* product name */}
                        <div className="mb-4">
                            <label 
                                htmlFor="productName" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Product name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                required
                                value={addproduct.productName}
                                onChange={handleUserInput}
                                minLength={5}
                                maxLength={20}
                                name="productName" 
                                id="productName" 
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                        </div>
                           {/* description */}
                        <div className="mb-4">
                            <label 
                                htmlFor="description" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <input 
                                type="text" 
                                required
                                onChange={handleUserInput}
                                minLength={5}
                                maxLength={60}
                                name="description" 
                                id="description" 
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                
                            />
                        </div>
                            {/* Price */}
                        <div className="mb-4">
                            <label 
                                htmlFor="price" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Product price <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                required
                                onChange={handleUserInput}
                                name="price" 
                                id="price" 
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                
                            />
                        </div>
                             {/* quantity */}
                        <div className="mb-4">
                            <label 
                                htmlFor="quantity" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Product quantity <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                required
                                onChange={handleUserInput}
                                name="quantity" 
                                id="quantity" 
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                
                            />
                        </div>
                            {/* category */}
                        <div className="mb-2">
                            <label 
                                htmlFor="category" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Select Category <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="category" 
                                id="category" 
                                value={addproduct.category}
                                onChange={handleUserInput}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Veg">Vegetarian</option>
                                <option value="Non-Veg">Non-Vegetarian</option>
                                <option value="drinks"> Soft drinks</option>
                                <option value="sides">sides</option>
                            </select>
                        </div>
                            {/* stock */}
                        <div className="mb-4">
                            <label
                                htmlFor="inStock"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Stock status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="inStock"
                                id="inStock"
                                value={addproduct.inStock}
                                onChange={handleUserInput}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="true">In stock</option>
                                <option value="false">Out of stock</option>
                            </select>
                        </div>
                            {/* image */}
                        <div className="mb-4">
                            <label 
                                htmlFor="productImage" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Product image <span className="text-red-600">(.jpg, .png, .jpeg )</span>
                            </label>
                            <input 
                                type="file"
                                required
                                onChange={handleUserInput}
                                name="image"
                                id="productImage"
                                accept=".jpg, .jpeg, .png"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                         <button
                            type="submit"
                            className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                            Add product
                        </button>
                    </form>

                    <div className="mt-8">
                        <h3 className="mb-4 text-xl font-semibold">Manage products</h3>
                        {productsData.length > 0 ? (
                            <div className="space-y-4">
                                {productsData.map((item) => (
                                    <div key={item._id} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg">
                                        <div className="w-full md:w-28 h-28 overflow-hidden rounded-lg bg-slate-100">
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="object-cover object-center w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-semibold text-gray-900">{item.productName}</p>
                                            <p className="text-sm text-gray-600">{item.category}</p>
                                            <p className="text-sm text-gray-600">${item.price} • Qty: {item.quantity}</p>
                                            <p className="text-sm text-gray-500 truncate">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProduct(item._id)}
                                            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No products found yet.</p>
                        )}
                    </div>

                    </div>

                </div>
            </section>
        </Layout>
    )
}
export default Addproduct;
