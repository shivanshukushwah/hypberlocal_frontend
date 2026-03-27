import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center w-full">
            <Link to="/" className="text-xl sm:text-2xl font-bold gradient-text flex items-center gap-1.5 sm:gap-2">
                <ShoppingBag className="text-teal-500" strokeWidth={2.5} size={24} sm:size={28} /> 
                <span className="tracking-tight">HyperLocal</span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-6">
                <Link to="/cart" className="relative flex items-center p-2 text-slate-500 hover:text-teal-600 transition-colors">
                    <ShoppingCart size={22} sm:size={24} />
                    {cart.items.length > 0 && (
                        <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow">
                            {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    )}
                </Link>
                {token ? (
                    <>
                        {user?.role === 'CUSTOMER' && (
                            <Link to="/orders" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">Orders</Link>
                        )}
                        <div className="flex flex-col items-end">
                            <Link to="/profile" className="text-xs sm:text-sm font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 max-w-[80px] sm:max-w-none">
                                {user?.name.split(' ')[0] || 'Profile'}
                            </Link>
                            <span className="text-[10px] sm:text-xs font-semibold text-teal-600 bg-teal-50 px-1.5 sm:px-2 py-0.5 rounded shadow-sm border border-teal-100 uppercase">{user?.role || 'USER'}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors ml-1 sm:ml-2">
                            <LogOut size={16} sm:size={18} /> <span className="hidden xs:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">Sign In</Link>
                        <Link to="/register" className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs sm:text-sm font-semibold hover-scale shadow-lg shadow-teal-500/30 flex items-center gap-1.5 sm:gap-2">
                            <User size={14} sm:size={16} /> <span className="hidden sm:inline">Get Started</span>
                            <span className="sm:hidden">Join</span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
