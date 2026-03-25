import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, MapPin, Navigation, CheckCircle2, Truck } from 'lucide-react';

const DeliveryDashboard = () => {
    const [availableOrders, setAvailableOrders] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const [availRes, myRes] = await Promise.all([
                axios.get('https://hypberlocal-backend.onrender.com/api/orders/delivery/available', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('https://hypberlocal-backend.onrender.com/api/orders', { headers: { Authorization: `Bearer ${token}` } }) // orderRoutes returns orders where deliveryPartnerId = me
            ]);
            setAvailableOrders(availRes.data);
            setMyDeliveries(myRes.data);
        } catch (error) {
            console.error("Failed to fetch delivery orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const acceptOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://hypberlocal-backend.onrender.com/api/orders/${orderId}/assign`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch (error) {
            alert('Failed to accept order');
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://hypberlocal-backend.onrender.com/api/orders/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="text-center p-12 text-teal-600 font-bold animate-pulse">Scanning for nearby jobs...</div>;

    return (
        <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
            {/* Active Deliveries */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Truck className="text-teal-600" /> My Active Deliveries ({myDeliveries.filter(o => o.status !== 'DELIVERED').length})
                </h3>
                
                {myDeliveries.filter(o => o.status !== 'DELIVERED').length === 0 ? (
                    <div className="glass p-8 text-center rounded-3xl border border-slate-100 mb-8">
                        <p className="text-slate-500 font-medium">You don't have any active deliveries right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {myDeliveries.filter(o => o.status !== 'DELIVERED').map(order => (
                            <div key={order._id} className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Truck size={80}/></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-lg text-slate-800">Order from {order.shopId?.shopName || 'Retailer'}</h4>
                                        <span className="font-extrabold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-lg text-xs tracking-wide">{order.status}</span>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-full shrink-0"><MapPin size={16} className="text-orange-500"/></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Pickup From</p>
                                                <p className="text-sm font-semibold text-slate-700">{order.shopId?.address || 'Shop Address'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-full shrink-0"><Navigation size={16} className="text-teal-500"/></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Deliver To</p>
                                                <p className="text-sm font-semibold text-slate-700">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {order.status === 'PLACED' || order.status === 'READY_FOR_PICKUP' || order.status === 'PREPARING' ? (
                                            <button onClick={() => updateStatus(order._id, 'OUT_FOR_DELIVERY')} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow hover:bg-indigo-700 transition-colors">Start Delivery</button>
                                        ) : order.status === 'OUT_FOR_DELIVERY' ? (
                                            <button onClick={() => updateStatus(order._id, 'DELIVERED')} className="flex-1 py-3 bg-teal-500 text-white font-bold rounded-xl text-sm shadow hover:bg-teal-600 transition-colors flex justify-center items-center gap-2"><CheckCircle2 size={18}/> Mark Delivered</button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Orders */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Package className="text-orange-500" /> Available Delivery Jobs
                </h3>

                {availableOrders.length === 0 ? (
                    <div className="glass p-12 text-center rounded-3xl border border-slate-100">
                        <Package size={48} className="mx-auto text-slate-300 mb-4" />
                        <h4 className="text-xl font-bold text-slate-700 mb-2">No jobs available right now</h4>
                        <p className="text-slate-500">Wait for nearby shops to receive new orders.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {availableOrders.map(order => (
                            <div key={order._id} className="glass p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="space-y-2 text-center sm:text-left">
                                    <h5 className="font-bold text-slate-800 text-lg">Order from {order.shopId?.shopName}</h5>
                                    <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1"><MapPin size={14}/> {order.shopId?.address}</p>
                                    <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1"><Navigation size={14}/> {order.deliveryAddress}</p>
                                </div>
                                <button onClick={() => acceptOrder(order._id)} className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all shrink-0">
                                    Accept Job
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;
