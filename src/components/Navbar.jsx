import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShoppingCart, Wallet } from 'lucide-react';
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
        <nav className="sticky top-0 z-50 glass border-b border-emerald-100/50 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-600 to-cyan-700 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
                        <ShoppingBag className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black gradient-text tracking-tighter">
                        HyperLocal
                    </h1>
                </Link>

                <div className="flex items-center gap-2 sm:gap-6">
                    <Link to="/cart" className="p-2 sm:p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative group active:scale-90">
                        <ShoppingCart size={22} className="sm:w-6 sm:h-6" />
                        {cart.items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full shadow-md shadow-amber-200 border-2 border-white">
                                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    {token ? (
                        <div className="flex items-center gap-2 sm:gap-4 ml-1 sm:ml-0">
                            <Link to="/wallet" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative group active:scale-90">
                                <Wallet size={22} className="sm:w-6 sm:h-6" />
                            </Link>
                            <Link to="/profile" className="flex items-center gap-2 p-1 sm:p-1.5 pr-2 sm:pr-4 rounded-full bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group active:scale-95">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:from-emerald-600 group-hover:to-cyan-700 group-hover:text-white transition-all">
                                    <User size={18} />
                                </div>
                                <span className="hidden sm:inline font-bold text-slate-700 text-sm group-hover:text-emerald-600 transition-colors uppercase tracking-wider">{user?.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors active:scale-90">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-emerald-600 text-white font-black text-xs sm:text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95 transition-all uppercase tracking-widest">
                            Join
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
