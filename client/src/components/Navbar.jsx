import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserCircle, LogOut } from "lucide-react";
import React, { useState } from "react";
import LogoutModal from "./layout/LogoutModal";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="flex items-center justify-between px-10 py-5">
            <h1 className="text-2xl font-bold text-blue-600">Salesor</h1>

            <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
                <Link to="/" className="cursor-pointer hover:text-blue-600">Home</Link>
                <Link to="/pricing" className="cursor-pointer hover:text-blue-600">Pricing</Link>
                <Link to="/info" className="cursor-pointer hover:text-blue-600">Info</Link>
                <Link to="/contact" className="cursor-pointer hover:text-blue-600">Contact</Link>
            </ul>

            <div className="flex gap-4 items-center">
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                        >
                            <UserCircle size={28} />
                            <span>{user.name}</span>
                        </Link>
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors cursor-pointer text-sm font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 font-medium">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-black text-white px-4 py-2 rounded-md transition-all hover:bg-gray-800"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogout} 
            />
        </nav>
    );
};

export default Navbar;