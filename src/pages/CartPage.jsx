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
        <div className="max-w-4xl mx-auto w-full animate-[fade-in_0.3s_ease-out]">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-semibold mb-6">
                <ArrowLeft size={18} /> Continue Shopping
            </button>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                Checkout <span className="text-teal-600 text-xl font-bold bg-teal-50 px-3 py-1 rounded-lg">from {cart.shopName}</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-grow space-y-4">
                    <div className="glass p-6 rounded-3xl">
                        <h3 className="text-xl font-bold text-slate-700 mb-6 border-b border-slate-100 pb-4">Order Items ({cart.items.length})</h3>
                        <div className="space-y-6">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                        {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingCart size={24} className="text-slate-300"/></div>}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                                        <p className="text-xs font-bold text-slate-500 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                                        <p className="font-extrabold text-teal-600 mt-2">₹{item.price * item.quantity}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product._id, item.size)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors shrink-0">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Panel */}
                <div className="w-full md:w-96 shrink-0">
                    <div className="glass p-6 rounded-3xl sticky top-24">
                        <h3 className="text-xl font-bold text-slate-700 mb-6">Order Summary</h3>
                        
                        <div className="space-y-3 mb-6 font-medium text-slate-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="text-teal-500 font-bold">Free (Local)</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between font-extrabold text-slate-800 text-lg">
                                <span>Total Payable</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                        </div>

                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><MapPin size={16}/> Delivery Address</label>
                                <textarea required rows="3" placeholder="Enter complete address..." 
                                    className="w-full bg-white/60 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-medium text-sm"
                                    value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                                <p className="text-xs font-semibold text-indigo-700 flex items-center gap-2">Payment Method: <strong>Cash on Delivery (COD)</strong></p>
                            </div>

                            <button type="submit" disabled={isPlacing} className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-extrabold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                                {isPlacing ? 'Placing Order...' : 'Confirm & Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
