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
        <div className="flex flex-col md:flex-row gap-8 w-full animate-[fade-in_0.3s_ease-out]">
            {/* Products Feed */}
            <div className="flex-grow">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-semibold mb-6">
                    <ArrowLeft size={18} /> Back to neighborhood
                </button>
                
                <h2 className="text-3xl font-extrabold text-slate-800 mb-8">Shop Collection</h2>

                {products.length === 0 ? (
                    <div className="glass p-12 text-center rounded-3xl border border-teal-100">
                        <p className="text-slate-500">This shop hasn't published any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(p => (
                            <div key={p._id} className="glass rounded-3xl overflow-hidden hover-scale group relative pb-16">
                                <div className="h-56 bg-slate-100 relative border-b border-slate-100">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col justify-center items-center text-slate-300 font-bold"><ShoppingCart size={40} className="mb-2"/> No Image</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm z-10">
                                        {p.category}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="text-lg font-bold text-slate-800 line-clamp-1">{p.name}</h4>
                                    <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[40px]">{p.description || "Premium localized clothing."}</p>
                                    <p className="text-2xl font-black text-teal-600 mt-2">₹{p.price}</p>
                                </div>

                                {/* Sizes & Add to Cart Action */}
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                                    <div className="flex gap-1 overflow-x-auto select-hide">
                                        {p.sizesAvailable.map(size => (
                                            <button key={size} onClick={() => handleAddToCart(p, size)} className="bg-slate-100 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 border border-transparent text-slate-600 text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 group/btn shrink-0">
                                                {size} <Plus size={12} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
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
            <div className="w-full md:w-80 shrink-0">
                <div className="glass p-6 rounded-3xl sticky top-24">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <ShoppingCart className="text-teal-500" /> Your Cart
                    </h3>

                    {cart.items.length === 0 || cart.shopId !== id ? (
                        <p className="text-slate-400 text-sm text-center py-6">Your shopping bag for this shop is empty.</p>
                    ) : (
                        <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 truncate max-w-[140px]">{item.product.name}</p>
                                        <p className="text-xs text-slate-500 font-semibold">Size: {item.size} x {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-teal-600">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-4 mb-6">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                            <span>Subtotal</span>
                            <span>₹{cart.shopId === id ? cart.totalAmount : 0}</span>
                        </div>
                    </div>

                    <button 
                        disabled={cart.items.length === 0 || cart.shopId !== id}
                        onClick={() => navigate('/cart')}
                        className="w-full py-3.5 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover-scale shadow-lg shadow-teal-500/20">
                        View Full Cart <ArrowRight size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
