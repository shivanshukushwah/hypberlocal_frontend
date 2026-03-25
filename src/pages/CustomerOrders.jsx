import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PackageOpen, Clock, CheckCircle2, Truck } from 'lucide-react';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://hypberlocal-backend.onrender.com/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center p-12 animate-pulse text-teal-600 font-bold">Loading your orders...</div>;

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'PLACED': { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock size={14}/> },
            'PREPARING': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <PackageOpen size={14}/> },
            'READY_FOR_PICKUP': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle2 size={14}/> },
            'OUT_FOR_DELIVERY': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <Truck size={14}/> },
            'DELIVERED': { color: 'bg-teal-100 text-teal-700 border-teal-200', icon: <CheckCircle2 size={14}/> },
        };
        const config = statusConfig[status] || statusConfig['PLACED'];
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                {config.icon} {status}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto w-full animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                <PackageOpen className="text-teal-600" /> Order History
            </h2>

            {orders.length === 0 ? (
                <div className="glass p-12 text-center rounded-3xl border border-teal-100">
                    <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="glass p-6 rounded-3xl group">
                            <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800">{order.shopId?.shopName || 'Unknown Shop'}</h4>
                                    <p className="text-sm text-slate-500 font-semibold">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <h4 className="font-extrabold text-xl text-teal-600">₹{order.totalAmount}</h4>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>
                            
                            <div className="bg-white/60 p-4 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Items</p>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm font-medium text-slate-700">
                                            <span>{item.quantity}x Item (Size: {item.size})</span>
                                            <span>₹{item.priceAtPurchase * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;
