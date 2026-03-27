import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Trash2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isPlacing, setIsPlacing] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to place an order");
            navigate('/login');
            return;
        }
        if (!deliveryAddress) {
            alert("Please provide a delivery address");
            return;
        }

        setIsPlacing(true);
        const orderItems = cart.items.map(item => ({
            productId: item.product._id,
            size: item.size,
            quantity: item.quantity,
            priceAtPurchase: item.product.price
        }));

        try {
            await axios.post('https://hypberlocal-backend.onrender.com/api/orders', {
                shopId: cart.shopId,
                items: orderItems,
                totalAmount: cart.totalAmount,
                deliveryAddress: deliveryAddress,
                paymentMethod: 'COD'
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert("Order placed successfully! (Cash on Delivery)");
            clearCart();
            navigate('/orders'); // Redirect to order history
        } catch (err) {
            alert('Failed to place order. ' + (err.response?.data?.error || err.message));
        } finally {
            setIsPlacing(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-[fade-in_0.3s_ease-out]">
                <div className="p-6 bg-slate-100 rounded-full mb-6">
                    <ShoppingCart size={48} className="text-slate-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-8 font-medium max-w-md">Looks like you haven't added anything to your cart yet. Discover nearby shops to get started.</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full bg-teal-500 text-white font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all cursor-pointer">
                    Browse Nearby Shops
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 animate-[fade-in_0.3s_ease-out]">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-bold mb-4 sm:mb-6 text-sm">
                <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 leading-tight">
                Checkout <span className="text-teal-600 text-sm sm:text-xl font-bold bg-teal-50 px-2.5 sm:px-3 py-1 rounded-lg w-fit">from {cart.shopName}</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                {/* Cart Items List */}
                <div className="flex-grow space-y-4">
                    <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/40">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-4 sm:mb-6 border-b border-slate-100 pb-3 sm:pb-4">Order Summary ({cart.items.length})</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 sm:gap-4 items-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                        {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingCart size={20} sm:size={24} className="text-slate-300"/></div>}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-800 truncate">{item.product.name}</h4>
                                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">SIZE: {item.size} • QTY: {item.quantity}</p>
                                        <p className="font-extrabold text-teal-600 mt-1 sm:mt-2 text-sm sm:text-base">₹{item.price * item.quantity}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product._id, item.size)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors shrink-0 active:scale-90">
                                        <Trash2 size={18} sm:size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Panel */}
                <div className="w-full md:w-96 shrink-0 pb-8 md:pb-0">
                    <div className="glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl sticky top-24 border border-teal-50 shadow-xl shadow-teal-500/5">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-4 sm:mb-6">Payment Overview</h3>
                        
                        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6 font-medium text-slate-600 text-sm sm:text-base">
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1">Delivery <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Local</span></span>
                                <span className="text-teal-500 font-bold">FREE</span>
                            </div>
                            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between font-extrabold text-slate-800 text-base sm:text-lg">
                                <span>Grand Total</span>
                                <span className="text-teal-600">₹{cart.totalAmount}</span>
                            </div>
                        </div>

                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><MapPin size={16} className="text-teal-500"/> Delivery Location</label>
                                <textarea required rows="2" placeholder="Street, landmark, house number..." 
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-medium text-xs sm:text-sm shadow-inner"
                                    value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Method</span>
                                <p className="text-xs font-bold text-slate-700">Cash on Delivery</p>
                            </div>

                            <button type="submit" disabled={isPlacing} className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isPlacing ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
