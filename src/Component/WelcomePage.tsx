// src/Component/WelcomePage.js
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                Welcome to KaamDO
            </h1>
            <p className="text-lg mb-12 text-center max-w-md">
                Choose your role to continue — whether you're here to post jobs or to take them up.
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-6">
                <button
                    onClick={() => navigate("/vendor-login")}
                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition"
                >
                    I’m a Vendor
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-purple-100 transition"
                >
                    I’m a User
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
