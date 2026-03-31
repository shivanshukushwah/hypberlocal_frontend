import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, MapPin, Zap } from 'lucide-react';

import CustomerFeed from '../components/CustomerFeed';
import ShopDashboard from '../components/ShopDashboard';
import DeliveryDashboard from '../components/DeliveryDashboard';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // Guest User Prompt
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 animate-float">
                    <Sparkles size={14} />
                    <span>The Future of Local Commerce</span>
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-[0.9] max-w-4xl">
                    Your Neighborhood, <br /> <span className="gradient-text">Redefined.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">
                    Experience lightning-fast delivery from your favorite local shops. 
                    HyperLocal brings the best of your community directly to your door.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4 sm:px-0">
                    <Link to="/register" className="btn-primary px-10 py-5 text-xl flex items-center justify-center gap-3 group">
                        Get Started <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                    <Link to="/login" className="glass hover:bg-white/10 px-10 py-5 rounded-2xl text-white font-bold text-xl flex items-center justify-center transition-all">
                        Sign In
                    </Link>
                </div>

                {/* Features bar */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl px-4">
                    {[
                        { icon: <Zap size={20}/>, title: 'Instant Delivery', desc: 'Minutes, not days.' },
                        { icon: <MapPin size={20}/>, title: 'Local Shops', desc: 'Support your community.' },
                        { icon: <ShoppingBag size={20}/>, title: 'Premium Quality', desc: 'Handpicked products.' }
                    ].map((feat, i) => (
                        <div key={i} className="glass p-6 rounded-3xl text-left border-white/5 hover:border-white/10 transition-colors">
                            <div className="text-indigo-400 mb-4">{feat.icon}</div>
                            <h3 className="text-white font-bold mb-1">{feat.title}</h3>
                            <p className="text-slate-500 text-sm">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Authenticated Views
    return (
        <div className="w-full mt-6 sm:mt-10 animate-[fade-in_0.5s_ease-out] px-4">
            <div className="glass p-8 rounded-[2.5rem] border-white/5 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Hi, <span className="gradient-text">{user.name.split(' ')[0]}</span>
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium">
                            {user.role === 'CUSTOMER' && "Exploring what's new in your neighborhood?"}
                            {user.role === 'SHOPKEEPER' && "Your business at a glance."}
                            {user.role === 'DELIVERY' && "Ready to hit the road?"}
                        </p>
                    </div>
                    {user.role === 'CUSTOMER' && (
                        <div className="flex gap-4">
                            <button className="glass-indigo px-6 py-3 rounded-2xl text-indigo-300 font-bold text-sm uppercase tracking-widest hover:bg-indigo-500/20 transition-all flex items-center gap-2">
                                <MapPin size={16} /> Trends
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Basic Dashboard Switcher Based on Role */}
            <div className="space-y-10">
                {user.role === 'CUSTOMER' && <CustomerFeed />}
                {user.role === 'SHOPKEEPER' && <ShopDashboard />}
                {user.role === 'DELIVERY' && <DeliveryDashboard />}
            </div>
        </div>
    );
};

export default Home;
