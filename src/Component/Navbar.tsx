import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navigate = useNavigate()

    function logout(){
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <>
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 bg-blue-500 hover:bg-blue-600 transition-color duration-500 text-white">
                {/* Logo */}
                <div className="text-2xl font-bold cursor-pointer">KaamDo</div>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-6">
                    <a href="#" className="hover:text-gray-300 transition">
                        Link 1
                    </a>
                    <a href="#" className="hover:text-gray-300 transition">
                        Link 2
                    </a>
                    <Link to="/assigned-jobs" className="hover:text-gray-300 transition">
                        Assigned Job
                    </Link>
                    <button onClick={()=>logout()}>
                        Logout
                    </button>
                </div>

                {/* Hamburger for mobile */}
                <div className="md:hidden">
                    <button onClick={toggleSidebar}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Sidebar for small screens */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-blue-500 text-white transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <button onClick={toggleSidebar}>
                        <X size={26} />
                    </button>
                </div>

                <div className="flex flex-col p-6 gap-4">
                    <a href="#" className="hover:text-gray-300 transition">
                        Link 1
                    </a>
                    <a href="#" className="hover:text-gray-300 transition">
                        Link 2
                    </a>
                    <a href="#" className="hover:text-gray-300 transition">
                        Link 3
                    </a>
                    <a href="#" className="hover:text-gray-300 transition">
                        Link 4
                    </a>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Navbar;
