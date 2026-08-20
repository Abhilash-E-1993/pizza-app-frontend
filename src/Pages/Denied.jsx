import { useNavigate } from "react-router-dom";

function Denied() {

    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm">
                <p className="text-6xl font-semibold text-gray-900 mb-2">403</p>
                <p className="text-sm font-medium text-gray-900 mb-1">Access denied</p>
                <p className="text-sm text-gray-400 mb-6">
                    You don&rsquo;t have permission to view this page.
                </p>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Go back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-2.5 text-sm text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                    >
                        Go home
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Denied;