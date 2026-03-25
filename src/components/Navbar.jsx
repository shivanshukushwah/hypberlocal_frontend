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
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center w-full">
            <Link to="/" className="text-2xl font-bold gradient-text flex items-center gap-2">
                <ShoppingBag className="text-teal-500" strokeWidth={2.5} size={28} /> 
                <span className="tracking-tight">HyperLocal</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/cart" className="relative flex items-center p-2 text-slate-500 hover:text-teal-600 transition-colors">
                    <ShoppingCart size={24} />
                    {cart.items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                            {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    )}
                </Link>
                {token ? (
                    <>
                        {user?.role === 'CUSTOMER' && (
                            <Link to="/orders" className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors mr-2">Orders</Link>
                        )}
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <Link to="/profile" className="text-sm font-bold text-slate-800 hover:text-teal-600 transition-colors">{user?.name || 'Profile'}</Link>
                            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded shadow-sm border border-teal-100">{user?.role || 'USER'}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors">
                            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">Sign In</Link>
                        <Link to="/register" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-semibold hover-scale shadow-lg shadow-teal-500/30 flex items-center gap-2">
                            <User size={16} /> Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
