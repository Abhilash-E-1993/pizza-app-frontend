import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layouts/Layout";
import { getAllProducts } from "../../Redux/Slices/ProductSlice";
import ProductCard from "../../Components/ProductCard";

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-100" />
            <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
        </div>
    );
}

function Products() {
    const dispatch = useDispatch();
    const { productsData, productsLoading, productsLoaded } = useSelector((state) => state.product);
    const [activeCategory, setActiveCategory] = useState("All");

    // Products are cached in the store — only fetch on the first visit.
    useEffect(() => {
        if (!productsLoaded) dispatch(getAllProducts());
    }, [dispatch, productsLoaded]);

    const categories = useMemo(
        () => ["All", ...new Set(productsData.map((p) => p.category))],
        [productsData]
    );

    const filtered = useMemo(
        () =>
            productsData.filter(
                (p) => p.inStock && (activeCategory === "All" || p.category === activeCategory)
            ),
        [productsData, activeCategory]
    );

    const showSkeletons = productsLoading && !productsLoaded;

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen">
                <div className="px-5 mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Menu</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {showSkeletons
                                ? "Loading…"
                                : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} available`}
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
                    {showSkeletons ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((item) => (
                                <ProductCard key={item._id} product={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-3">🍕</p>
                            <p className="text-sm text-gray-400">
                                Nothing available in this category right now.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export default Products;