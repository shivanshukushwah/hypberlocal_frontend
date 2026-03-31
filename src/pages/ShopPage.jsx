import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const { cart, addToCart } = useCart(); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://hypberlocal-backend.onrender.com/api/products?shopId=${id}`)
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = (product, size) => {
        addToCart(product, id, "Current Shop", 1, size);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="text-center animate-pulse text-indigo-600 font-black uppercase tracking-widest text-xs">Loading shop inventory...</div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full animate-[fade-in_0.3s_ease-out]">
            {/* Products Feed */}
            <div className="flex-grow">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 font-bold mb-4 sm:mb-6 text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Back to Search
                </button>
                
                <h2 className="text-2xl sm:text-4xl font-black text-slate-800 mb-6 sm:mb-10 tracking-tight">Shop Collection</h2>

                {products.length === 0 ? (
                    <div className="glass p-8 sm:p-12 text-center rounded-[2rem] border border-indigo-50 shadow-inner">
                        <p className="text-slate-500 text-sm sm:text-base font-medium italic">This shop hasn't published any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {products.map(p => (
                            <div key={p._id} className="glass rounded-[2rem] overflow-hidden hover-scale group relative pb-14 sm:pb-16 flex flex-col border border-transparent hover:border-indigo-100 transition-all">
                                <div className="h-40 sm:h-64 bg-slate-50 relative border-b border-slate-50 shrink-0 overflow-hidden">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col justify-center items-center text-slate-300 font-bold bg-indigo-50/30">
                                            <ShoppingCart size={32} sm:size={48} className="mb-2 opacity-50" /> 
                                            <span className="text-[10px] uppercase tracking-widest">Premium Quality</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[10px] font-black text-indigo-700 shadow-sm z-10 uppercase tracking-widest border border-indigo-50">
                                        {p.category}
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 flex-grow">
                                    <h4 className="text-sm sm:text-xl font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">{p.name}</h4>
                                    <p className="text-[10px] sm:text-sm text-slate-500 mt-1 sm:mt-2 line-clamp-2 min-h-[30px] sm:min-h-[40px] leading-tight font-medium">{p.description || "Premium quality clothing for the modern individual."}</p>
                                    <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-2 sm:mt-4">₹{p.price}</p>
                                </div>

                                {/* Sizes & Add to Cart Action */}
                                <div className="absolute bottom-0 left-0 w-full p-3 sm:p-5 bg-white/80 backdrop-blur border-t border-indigo-50/50 flex items-center justify-between gap-2">
                                    <div className="flex gap-1.5 overflow-x-auto select-hide w-full">
                                        {p.sizesAvailable.map(size => (
                                            <button key={size} onClick={() => handleAddToCart(p, size)} className="bg-white hover:bg-amber-500 hover:text-white border border-slate-100 hover:border-amber-500 text-slate-800 text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-black transition-all flex items-center gap-1 shrink-0 uppercase tracking-wider shadow-sm active:scale-90">
                                                {size} <Plus size={10} sm:size={12} className="sm:inline hidden" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shopping Cart Sidebar */}
            <div className="w-full lg:w-96 shrink-0 mt-8 lg:mt-0">
                <div className="glass p-6 sm:p-8 rounded-[2.5rem] sticky top-24 border border-indigo-100 shadow-2xl shadow-indigo-500/10">
                    <h3 className="text-xl sm:text-2xl font-black flex items-center gap-3 mb-6 sm:mb-8 tracking-tight">
                        <ShoppingCart className="text-indigo-600" size={24} sm:size={28} /> Your Bag
                    </h3>

                    {cart.items.length === 0 || cart.shopId !== id ? (
                        <div className="py-12 flex flex-col items-center justify-center opacity-40">
                            <ShoppingBag size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest text-center">Bag is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-8 max-h-[35vh] lg:max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-3 sm:p-4 rounded-2xl border border-slate-100 group">
                                    <div className="min-w-0">
                                        <p className="font-black text-xs sm:text-sm text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{item.product.name}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{item.size} • Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-indigo-600 text-xs sm:text-base whitespace-nowrap ml-4">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-slate-100 pt-6 mb-6 sm:mb-8">
                        <div className="flex justify-between items-center font-black text-slate-800">
                            <span className="text-sm sm:text-lg uppercase tracking-widest text-slate-400">Total</span>
                            <span className="text-2xl sm:text-3xl font-black text-indigo-600">₹{cart.shopId === id ? cart.totalAmount : 0}</span>
                        </div>
                    </div>

                    <button 
                        disabled={cart.items.length === 0 || cart.shopId !== id}
                        onClick={() => navigate('/cart')}
                        className="w-full py-4 sm:py-5 flex justify-center items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-base sm:text-lg disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-widest">
                        Checkout Now <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
