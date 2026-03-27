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

    if (loading) return <div className="text-center p-12 animate-pulse text-teal-600 font-bold">Loading shop inventory...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full animate-[fade-in_0.3s_ease-out]">
            {/* Products Feed */}
            <div className="flex-grow">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-bold mb-4 sm:mb-6 text-sm">
                    <ArrowLeft size={16} /> Back
                </button>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6 sm:mb-8">Shop Collection</h2>

                {products.length === 0 ? (
                    <div className="glass p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-teal-100">
                        <p className="text-slate-500 text-sm sm:text-base">This shop hasn't published any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {products.map(p => (
                            <div key={p._id} className="glass rounded-2xl sm:rounded-3xl overflow-hidden hover-scale group relative pb-14 sm:pb-16 flex flex-col">
                                <div className="h-40 sm:h-56 bg-slate-100 relative border-b border-slate-100 shrink-0">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col justify-center items-center text-slate-300 font-bold"><ShoppingCart size={32} sm:size={40} className="mb-2"/> <span className="text-xs">No Image</span></div>
                                    )}
                                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-bold text-slate-600 shadow-sm z-10">
                                        {p.category}
                                    </div>
                                </div>
                                <div className="p-3 sm:p-5 flex-grow">
                                    <h4 className="text-sm sm:text-lg font-bold text-slate-800 line-clamp-1">{p.name}</h4>
                                    <p className="text-[10px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1 line-clamp-2 min-h-[30px] sm:min-h-[40px] leading-tight">{p.description || "Premium quality clothing."}</p>
                                    <p className="text-lg sm:text-2xl font-black text-teal-600 mt-1.5 sm:mt-2">₹{p.price}</p>
                                </div>

                                {/* Sizes & Add to Cart Action */}
                                <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-4 bg-white/80 backdrop-blur border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
                                    <div className="flex gap-1 overflow-x-auto select-hide w-full">
                                        {p.sizesAvailable.map(size => (
                                            <button key={size} onClick={() => handleAddToCart(p, size)} className="bg-slate-100 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 border border-transparent text-slate-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 shrink-0">
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
            <div className="w-full lg:w-80 shrink-0 mt-8 lg:mt-0">
                <div className="glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl sticky top-24 border border-teal-50 shadow-xl shadow-teal-500/5">
                    <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4 sm:mb-6">
                        <ShoppingCart className="text-teal-500" size={20} sm:size={24} /> Your Bag
                    </h3>

                    {cart.items.length === 0 || cart.shopId !== id ? (
                        <p className="text-slate-400 text-xs sm:text-sm text-center py-6 sm:py-8 font-medium">Your shopping bag for this shop is empty.</p>
                    ) : (
                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-[35vh] lg:max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-slate-50">
                                    <div className="min-w-0">
                                        <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">{item.product.name}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">{item.size} • Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-teal-600 text-xs sm:text-sm whitespace-nowrap ml-2">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-slate-100 pt-4 mb-4 sm:mb-6">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                            <span className="text-sm sm:text-base">Subtotal</span>
                            <span className="text-lg sm:text-xl">₹{cart.shopId === id ? cart.totalAmount : 0}</span>
                        </div>
                    </div>

                    <button 
                        disabled={cart.items.length === 0 || cart.shopId !== id}
                        onClick={() => navigate('/cart')}
                        className="w-full py-3 sm:py-3.5 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed hover-scale shadow-lg shadow-teal-500/20 active:scale-95 transition-transform">
                        Checkout Bag <ArrowRight size={16} sm:size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
