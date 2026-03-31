import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Trash2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isPlacing, setIsPlacing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

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
            if (paymentMethod === 'ONLINE') {
                // 1. Create Razorpay Order
                const { data: orderParams } = await axios.post('https://hypberlocal-backend.onrender.com/api/payments/create-order', {
                    amount: cart.totalAmount
                }, { headers: { Authorization: `Bearer ${token}` } });

                // 2. Initialize Razorpay Option
                const options = {
                    key: 'rzp_test_SXc9vw1QZaBL8j', // Using the provided test key
                    amount: orderParams.amount,
                    currency: "INR",
                    name: cart.shopName || "Hyperlocal",
                    description: "Order Payment",
                    order_id: orderParams.id,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment
                            await axios.post('https://hypberlocal-backend.onrender.com/api/payments/verify', {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            // 4. Place Order in DB as PAID
                            await axios.post('https://hypberlocal-backend.onrender.com/api/orders', {
                                shopId: cart.shopId,
                                items: orderItems,
                                totalAmount: cart.totalAmount,
                                deliveryAddress: deliveryAddress,
                                paymentMethod: 'ONLINE',
                                paymentStatus: 'PAID',
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            alert("Payment successful! Order placed.");
                            clearCart();
                            navigate('/orders');
                        } catch (err) {
                            alert("Payment verification failed! " + err.message);
                            setIsPlacing(false);
                        }
                    },
                    prefill: {
                        name: "Customer",
                        email: "customer@example.com",
                        contact: "9999999999"
                    },
                    theme: { color: "#4f46e5" }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response){
                    alert("Payment Failed: " + response.error.description);
                    setIsPlacing(false);
                });
                rzp.open();

            } else {
                // Cash On Delivery
                await axios.post('https://hypberlocal-backend.onrender.com/api/orders', {
                    shopId: cart.shopId,
                    items: orderItems,
                    totalAmount: cart.totalAmount,
                    deliveryAddress: deliveryAddress,
                    paymentMethod: 'COD',
                    paymentStatus: 'PENDING'
                }, { headers: { Authorization: `Bearer ${token}` } });
                
                alert("Order placed successfully! (Cash on Delivery)");
                clearCart();
                navigate('/orders');
            }
        } catch (err) {
            alert('Failed to place order. ' + (err.response?.data?.error || err.message));
            setIsPlacing(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-[fade-in_0.3s_ease-out]">
                <div className="p-8 bg-emerald-50 rounded-full mb-8 relative">
                    <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 rounded-full"></div>
                    <ShoppingCart size={48} className="text-emerald-400 relative z-10" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4 tracking-tight">Your bag is empty</h2>
                <p className="text-slate-500 mb-10 font-medium max-w-md leading-relaxed">Discover clothing from local boutiques and shops right around your corner. Support local and get fast delivery.</p>
                <button onClick={() => navigate('/')} className="px-10 py-4 rounded-full bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95 transition-all cursor-pointer uppercase tracking-widest text-sm">
                    Browse Nearby Shops
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full px-2 sm:px-4 animate-[fade-in_0.3s_ease-out]">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 font-bold mb-6 sm:mb-8 text-xs uppercase tracking-widest transition-colors">
                <ArrowLeft size={16} /> Back to Shop
            </button>
            
            <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
                {/* Cart Items List */}
                <div className="flex-grow">
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-800 mb-6 sm:mb-10 tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 leading-tight">
                        Checkout <span className="text-emerald-600 text-sm sm:text-lg font-black bg-emerald-50 px-3 py-1.5 rounded-xl w-fit uppercase tracking-widest border border-emerald-100/50">from {cart.shopName}</span>
                    </h2>

                    <div className="glass p-6 sm:p-10 rounded-[2.5rem] border border-emerald-50/50 shadow-sm">
                        <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-6 sm:mb-10 border-b border-slate-50 pb-6 tracking-tight">Order Summary <span className="text-slate-300 ml-2 font-medium">({cart.items.length})</span></h3>
                        <div className="space-y-6 sm:space-y-10">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 sm:gap-8 items-center group">
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl sm:rounded-[2rem] overflow-hidden shrink-0 border border-slate-50 group-hover:shadow-lg transition-shadow">
                                        {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center bg-emerald-50/30 text-emerald-200"><ShoppingCart size={32} /></div>}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-black text-sm sm:text-xl text-slate-800 truncate tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{item.product.name}</h4>
                                        <p className="text-[10px] sm:text-xs font-black text-slate-400 mt-1 uppercase tracking-widest">SIZE: {item.size} • QTY: {item.quantity}</p>
                                        <p className="font-black text-emerald-600 mt-2 sm:mt-4 text-base sm:text-2xl">₹{item.price * item.quantity}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product._id, item.size)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all shrink-0 active:scale-90 border border-transparent hover:border-rose-100">
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Panel */}
                <div className="w-full md:w-96 shrink-0 pb-12 md:pb-0">
                    <div className="glass p-6 sm:p-10 rounded-[2.5rem] sticky top-24 border border-emerald-100 shadow-2xl shadow-emerald-500/10">
                        <h3 className="text-lg sm:text-2xl font-black text-slate-800 mb-8 sm:mb-10 tracking-tight uppercase">Payment</h3>
                        
                        <div className="space-y-4 mb-8 sm:mb-12 font-bold text-slate-500 text-sm sm:text-base border-b border-slate-50 pb-8">
                            <div className="flex justify-between">
                                <span className="uppercase tracking-widest text-xs">Subtotal</span>
                                <span className="text-slate-800">₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1.5 uppercase tracking-widest text-xs">Delivery <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black tracking-widest shadow-sm">Fast</span></span>
                                <span className="text-emerald-600 font-black">FREE</span>
                            </div>
                            <div className="pt-4 mt-6 flex justify-between font-black text-slate-800 text-lg sm:text-2xl border-t border-slate-50">
                                <span className="uppercase tracking-tighter">Total</span>
                                <span className="text-emerald-600">₹{cart.totalAmount}</span>
                            </div>
                        </div>

                        <form onSubmit={handleCheckout} className="space-y-6 sm:space-y-8">
                            <div>
                                <label className="block text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-widest"><MapPin size={16} className="text-emerald-600"/> Delivery Address</label>
                                <textarea required rows="3" placeholder="Street, house number, landmark..." 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-bold text-xs sm:text-sm shadow-inner resize-none transition-all"
                                    value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 mt-2">Payment Method</div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setPaymentMethod('COD')} className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all font-bold flex flex-col items-center justify-center gap-1 ${paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_2px_#6366f1]' : 'border-slate-100 bg-white text-slate-400 hover:border-emerald-200'}`}>
                                        Cash on Delivery
                                    </button>
                                    <button type="button" onClick={() => setPaymentMethod('ONLINE')} className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all font-bold flex flex-col items-center justify-center gap-1 ${paymentMethod === 'ONLINE' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_2px_#6366f1]' : 'border-slate-100 bg-white text-slate-400 hover:border-emerald-200'}`}>
                                        Pay Online
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={isPlacing} className="w-full py-4 sm:py-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-base sm:text-xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-widest">
                                {isPlacing ? 'Processing...' : 'Place My Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
