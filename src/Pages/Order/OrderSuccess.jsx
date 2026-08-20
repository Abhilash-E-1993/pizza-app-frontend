import { useNavigate } from "react-router-dom";
import Layout from "../../Layouts/Layout";

function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <Layout>
            <section className="py-10 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white border border-gray-100 rounded-xl p-10 max-w-sm w-full mx-5 text-center">

                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Order placed</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        We&rsquo;ve received your order and it&rsquo;s being prepared.
                    </p>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            View my orders
                        </button>
                        <button
                            onClick={() => navigate("/products")}
                            className="w-full py-2.5 text-sm text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                        >
                            Browse menu
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default OrderSuccess;