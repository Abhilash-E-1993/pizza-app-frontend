import Layout from "../../Layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AddProducts, deleteProductById } from "../../Redux/Slices/AdminSlice";
import { getAllProducts } from "../../Redux/Slices/ProductSlice";
import toast from "react-hot-toast";

function AddProduct() {
    const dispatch = useDispatch();
    const productsData = useSelector((state) => state.product.productsData ?? []);

    const emptyForm = {
        productName: "", image: null, price: "",
        quantity: "", description: "", category: "Veg", inStock: "true",
    };

    const [form, setForm] = useState(emptyForm);

    function handleInput(e) {
        const { name, value, type, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] || null : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const allowed = ["Veg", "Non-Veg", "drinks", "sides"];
        if (!form.productName || !form.image || !form.price || !form.quantity || !form.description) {
            toast.error("Please fill all required fields");
            return;
        }
        if (form.productName.length < 5) { toast.error("Name must be at least 5 characters"); return; }
        if (form.description.length < 5) { toast.error("Description must be at least 5 characters"); return; }
        if (!allowed.includes(form.category)) { toast.error("Select a valid category"); return; }

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));

        const res = await dispatch(AddProducts(data));
        if (res?.meta?.requestStatus === "fulfilled") {
            setForm(emptyForm);
            e.target.reset();
            dispatch(getAllProducts());
        }
    }

    async function handleDelete(id) {
        const res = await dispatch(deleteProductById(id));
        if (res?.meta?.requestStatus === "fulfilled") dispatch(getAllProducts());
    }

    useEffect(() => { dispatch(getAllProducts()); }, [dispatch]);

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-5">

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                        {/* ── Form ── */}
                        <div className="lg:col-span-2">
                            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Add product</p>
                            <div className="bg-white border border-gray-100 rounded-xl p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Product name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text" name="productName" required
                                            minLength={5} maxLength={40}
                                            value={form.productName} onChange={handleInput}
                                            placeholder="e.g. Margherita"
                                            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                                        <input
                                            type="text" name="description" required
                                            minLength={5} maxLength={80}
                                            onChange={handleInput}
                                            placeholder="Short description…"
                                            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Price (₹) <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="number" name="price" required onChange={handleInput}
                                                placeholder="299"
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Quantity <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="number" name="quantity" required onChange={handleInput}
                                                placeholder="10"
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Category <span className="text-red-400">*</span>
                                            </label>
                                            <select
                                                name="category" value={form.category} onChange={handleInput}
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
                                            >
                                                <option value="Veg">Vegetarian</option>
                                                <option value="Non-Veg">Non-vegetarian</option>
                                                <option value="drinks">Soft drinks</option>
                                                <option value="sides">Sides</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Stock <span className="text-red-400">*</span>
                                            </label>
                                            <select
                                                name="inStock" value={form.inStock} onChange={handleInput}
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
                                            >
                                                <option value="true">In stock</option>
                                                <option value="false">Out of stock</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Image <span className="text-red-400">*</span>
                                        </label>
                                        <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-200 rounded-lg py-5 px-4 cursor-pointer hover:border-gray-300 transition bg-gray-50">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            <span className="text-xs text-gray-400">
                                                {form.image ? form.image.name : "Click to upload · .jpg .jpeg .png"}
                                            </span>
                                            <input
                                                type="file" name="image" required
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleInput}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition mt-2"
                                    >
                                        Add product
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* ── Product list ── */}
                        <div className="lg:col-span-3">
                            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                                Manage products
                                <span className="ml-2 normal-case text-gray-300">({productsData.length})</span>
                            </p>
                            <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
                                {productsData.length > 0 ? productsData.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4 px-5 py-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image} alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.productName}
                                                <span className="ml-2 text-xs font-normal text-gray-400 border border-gray-100 rounded-full px-2 py-0.5">
                                                    {item.category}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                <span className={`w-1.5 h-1.5 rounded-full inline-block ${item.inStock ? "bg-green-400" : "bg-red-400"}`} />
                                                {item.inStock ? "In stock" : "Out of stock"} · Qty {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 mr-2">₹{item.price}</span>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-1.5 border border-red-100 rounded-lg text-red-400 hover:bg-red-50 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-400 text-center py-10">No products yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default AddProduct;