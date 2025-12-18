import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, User, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('sarthi_phone');

    const handleLogout = () => {
        localStorage.removeItem('sarthi_phone');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'text-sage bg-sage/10' : 'text-charcoal/60 hover:text-sage';

    return (
        <nav className="w-full p-4 md:p-6 bg-cream border-b border-sage/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to={isLoggedIn ? "/chat" : "/"} className="text-2xl font-serif font-bold text-sage">
                    Sarthi
                </Link>

                {isLoggedIn ? (
                    <div className="flex items-center gap-2 md:gap-6">
                        <Link to="/chat" className={`p-3 rounded-xl transition-colors ${isActive('/chat')}`} title="Chat">
                            <MessageCircle size={28} />
                        </Link>
                        <Link to="/customize" className={`p-3 rounded-xl transition-colors ${isActive('/customize')}`} title="Customize">
                            <Settings size={28} />
                        </Link>
                        <Link to="/profile" className={`p-3 rounded-xl transition-colors ${isActive('/profile')}`} title="Profile">
                            <User size={28} />
                        </Link>
                        <button onClick={handleLogout} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Logout">
                            <LogOut size={28} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-6 text-sm font-medium">
                        <Link to="/login" className="px-4 py-2 border border-sage/30 rounded-lg text-sage hover:bg-sage/5 transition-colors">Login</Link>
                        <Link to="/signup" className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-[#5b7a1e] transition-colors shadow-md shadow-sage/20">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
