import pizzaImage from "../assets/images/pizzaImage.png";
import cookingImage from "../assets/images/cookImage.png";
import OrderFood from "../assets/images/foodOrder.png";
import pickUpImage from "../assets/images/pickup.png";
import enjoyImage from "../assets/images/enjoy.png";
import Layout from "../Layouts/Layout";
import { Link } from "react-router-dom";

function Home() {
    return (
        <Layout>

            {/* ── Hero ── */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-12">

                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                            Fresh · Fast · Delicious
                        </span>
                        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                            Pizza, the way<br />it&rsquo;s meant to be.
                        </h1>
                        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                            Order from our menu, choose your toppings, and get it delivered hot to your door.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                        >
                            Order now
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src={pizzaImage}
                            alt="Pizza"
                            className="w-72 md:w-96 object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats strip ── */}
            <section className="border-b border-gray-100 bg-gray-50">
                <div className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-3 divide-x divide-gray-100">
                    {[
                        { value: "4.9★", label: "Average rating" },
                        { value: "30 min", label: "Avg. delivery time" },
                        { value: "20+", label: "Menu items" },
                    ].map((s) => (
                        <div key={s.label} className="text-center px-4">
                            <p className="text-lg font-semibold text-gray-900">{s.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Chef section ── */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-5 py-16 md:py-20 flex flex-col md:flex-row items-center gap-12">

                    <div className="flex-1 flex justify-center">
                        <img
                            src={cookingImage}
                            alt="Chef cooking"
                            className="w-72 md:w-96 object-contain rounded-2xl"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                            Our promise
                        </span>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug mb-4">
                            Crafted by chefs who<br />care about every bite.
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                            Every pizza is made to order using fresh ingredients and traditional techniques.
                        </p>
                        <div className="space-y-3">
                            {[
                                "Perfect taste, every single time",
                                "Prepared in under 20 minutes",
                                "Food hygiene guaranteed",
                            ].map((point) => (
                                <div key={point} className="flex items-center gap-3 justify-center md:justify-start">
                                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-600">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ── How it works ── */}
            <section className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-5 py-16">
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
                            How it works
                        </span>
                        <h2 className="text-2xl font-semibold text-gray-900">Three steps to your pizza</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { img: OrderFood,   step: "01", title: "Choose your pizza",   desc: "Browse the menu and pick exactly what you're craving." },
                            { img: pickUpImage, step: "02", title: "We prepare it",        desc: "Our chefs get to work the moment your order comes in." },
                            { img: enjoyImage,  step: "03", title: "Enjoy every bite",     desc: "Delivered hot to your door, ready to dig in." },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                                    <img src={item.img} alt={item.title} className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-xs text-gray-300 font-medium mb-2">{item.step}</span>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-5 py-16 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ready to order?</h2>
                    <p className="text-sm text-gray-400 mb-6">Fresh pizzas, fast delivery. What&rsquo;s not to love.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        See the menu
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </section>

        </Layout>
    );
}

export default Home;