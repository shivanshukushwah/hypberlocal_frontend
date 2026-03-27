import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerFeed = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async (lat = 28.6139, lng = 77.2090) => {
            try {
                const res = await axios.get(`https://hypberlocal-backend.onrender.com/api/shops/nearby?lat=${lat}&lng=${lng}`);
                setShops(res.data);
            } catch (error) {
                console.error("Error fetching nearby shops");
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchShops(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation denied or failed, using default coords.");
                    fetchShops();
                }
            );
        } else {
            fetchShops();
        }
    }, []);

    if (loading) return <div className="text-center p-12 animate-pulse text-teal-600 font-bold">Scanning your area for shops...</div>;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="text-rose-500" size={20} sm:size={24} /> Nearby Boutiques
                </h3>
            </div>
            
            {shops.length === 0 ? (
                <div className="glass p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-teal-100 flex flex-col items-center">
                    <Navigation size={40} sm:size={48} className="text-slate-300 mb-4" />
                    <h4 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">No shops found here yet.</h4>
                    <p className="text-sm sm:text-base text-slate-500 max-w-md">Our network is growing! Check back soon or try expanding your search radius.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {shops.map(shop => (
                        <Link key={shop._id} to={`/shop/${shop._id}`} className="glass rounded-2xl sm:rounded-3xl overflow-hidden hover-scale cursor-pointer group block">
                            <div className="h-32 sm:h-40 bg-gradient-to-br from-teal-400 to-blue-500 relative flex items-center justify-center">
                                {/* Placeholder for shop cover photo */}
                                <ShoppingBag className="text-white/30" size={48} sm:size={64} />
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-teal-700 flex items-center gap-1 shadow-sm">
                                    <Star size={12} sm:size={14} className="text-yellow-500 fill-yellow-500" /> 4.8
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors truncate">{shop.shopName}</h4>
                                <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{shop.description || "A local clothing store offering premium quality apparel."}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 flex items-center gap-1 truncate max-w-[70%]">
                                        <MapPin size={12} sm:size={14} className="flex-shrink-0" /> {shop.address}
                                    </span>
                                    <span className="text-teal-500 p-1.5 sm:p-2 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors">
                                        <ArrowRight size={16} sm:size={18} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerFeed;
