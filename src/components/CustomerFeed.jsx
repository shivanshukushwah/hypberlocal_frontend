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

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="text-center animate-pulse text-emerald-600 font-black uppercase tracking-widest text-xs">Finding local shops...</div>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                    <MapPin className="text-emerald-600" size={20} sm:size={24} /> Nearby Boutiques
                </h3>
            </div>
            
            {shops.length === 0 ? (
                <div className="glass p-8 sm:p-12 text-center rounded-[2rem] border border-emerald-50 flex flex-col items-center shadow-inner">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Navigation size={40} sm:size={48} className="text-slate-300" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">No shops found here yet.</h4>
                    <p className="text-sm sm:text-base text-slate-500 max-w-md">Our network is growing! Check back soon or try expanding your search radius.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {shops.map(shop => (
                        <Link key={shop._id} to={`/shop/${shop._id}`} className="glass rounded-[2rem] overflow-hidden hover-scale cursor-pointer group block border border-transparent hover:border-emerald-100 transition-all">
                            <div className="h-40 sm:h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 relative flex items-center justify-center overflow-hidden">
                                {/* Decorative shape behind icon */}
                                <div className="absolute inset-0 bg-emerald-600/5 origin-bottom-left -rotate-12 transform scale-150"></div>
                                <ShoppingBag className="text-emerald-200/50 group-hover:scale-110 transition-transform duration-500" size={48} sm:size={64} />
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-black text-emerald-700 flex items-center gap-1.5 shadow-sm border border-emerald-50">
                                    <Star size={12} sm:size={14} className="text-amber-500 fill-amber-500" /> 4.8
                                </div>
                            </div>
                            <div className="p-5 sm:p-8">
                                <h4 className="text-lg sm:text-xl font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors truncate tracking-tight">{shop.shopName}</h4>
                                <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed font-medium">{shop.description || "A local clothing store offering premium quality apparel."}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1.5 truncate max-w-[70%]">
                                        <MapPin size={12} sm:size={14} className="flex-shrink-0 text-emerald-400" /> {shop.address}
                                    </span>
                                    <span className="text-emerald-600 p-2 sm:p-2.5 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-emerald-200">
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
