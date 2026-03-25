import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

import CustomerFeed from '../components/CustomerFeed';
import ShopDashboard from '../components/ShopDashboard';
import DeliveryDashboard from '../components/DeliveryDashboard';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // Guest User Prompt
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 animate-[fade-in_0.5s_ease-out]">
                <div className="inline-block p-4 bg-teal-100/50 rounded-full mb-6 relative">
                    <div className="absolute inset-0 bg-teal-400 blur-2xl opacity-20 rounded-full"></div>
                    <ShoppingBag size={56} className="text-teal-600 relative z-10" strokeWidth={1.5} />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-6 tracking-tight">
                    Your Neighborhood, <br /> <span className="gradient-text">Delivered Fast.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
                    Discover clothing from local boutiques and shops right around your corner. 
                    Support local and get it delivered in hours, not days.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/register" className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg hover-scale shadow-[0_0_30px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2">
                        Start Shopping <ArrowRight size={20} />
                    </Link>
                    <Link to="/login" className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg hover-scale shadow-lg border border-slate-200 flex items-center justify-center">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    // Authenticated Views
    return (
        <div className="w-full mt-4 animate-[fade-in_0.5s_ease-out]">
            <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-6 relative">
                <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-teal-500 to-blue-500"></div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800">Welcome back, {user.name.split(' ')[0]}</h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        {user.role === 'CUSTOMER' && "Here's what's trending in your area."}
                        {user.role === 'SHOPKEEPER' && "Let's overview your shop today."}
                        {user.role === 'DELIVERY' && "Ready to make some deliveries?"}
                    </p>
                </div>
                {user.role === 'CUSTOMER' && (
                    <div className="hidden sm:flex bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 gap-2 font-semibold">
                        <span className="text-slate-400 text-sm">Location:</span> 
                        <span className="text-teal-600 text-sm flex items-center gap-1 cursor-pointer">Current Location</span>
                    </div>
                )}
            </div>

            {/* Basic Dashboard Switcher Based on Role */}
            {user.role === 'CUSTOMER' && <CustomerFeed />}
            {user.role === 'SHOPKEEPER' && <ShopDashboard />}
            {user.role === 'DELIVERY' && <DeliveryDashboard />}
        </div>
    );
};

export default Home;
