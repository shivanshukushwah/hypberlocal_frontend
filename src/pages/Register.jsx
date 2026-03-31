import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Globe, Map, Sparkles, ArrowRight } from 'lucide-react';

const Register = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({ 
        name: '', email: location.state?.email || '', password: '', phone: '', 
        country: '', state: '', address: '', role: 'CUSTOMER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('https://hypberlocal-backend.onrender.com/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[100vh] w-full px-4 py-12 relative overflow-hidden">
             {/* Background decorative elements */}
             <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
             <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="glass w-full max-w-2xl p-8 sm:p-12 rounded-[3rem] relative z-10 animate-float">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 text-emerald-400">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                        Join the <span className="gradient-text">Network.</span>
                    </h2>
                    <p className="text-slate-400 font-medium tracking-wide max-w-md mx-auto">Start your journey with HyperLocal commerce today.</p>
                </div>
                
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mb-10 text-sm font-semibold flex items-center gap-3 animate-shake">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-8">
                     {/* Role Selection */}
                    <div className="bg-white/5 p-2 rounded-2xl border border-white/10 flex gap-2 mb-4 backdrop-blur-md">
                        {['CUSTOMER', 'SHOPKEEPER', 'DELIVERY'].map(role => (
                            <button 
                                key={role} 
                                type="button" 
                                onClick={() => setFormData({...formData, role})}
                                className={`flex-1 py-3.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest ${formData.role === role ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:bg-white/5'}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input type="text" name="name" required placeholder="Full Name" className="input-field pl-14 h-14" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input type="text" name="phone" required placeholder="+91 00000 00000" className="input-field pl-14 h-14" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Country</label>
                            <div className="relative">
                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input type="text" name="country" required placeholder="India" className="input-field pl-14 h-14" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">State</label>
                            <div className="relative">
                                <Map className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input type="text" name="state" required placeholder="State" className="input-field pl-14 h-14" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Complete Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input type="text" name="address" required placeholder="House No, Street, Landmark" className="input-field pl-14 h-14" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Account Email</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input type="email" name="email" required placeholder="your@email.com" value={formData.email} className="input-field pl-14 h-14" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Security Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input type="password" name="password" required placeholder="••••••••" className="input-field pl-14 h-14" onChange={handleChange} />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-4 mt-6 disabled:opacity-50 group"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                        {!loading && <ArrowRight size={24} className="group-hover:translate-x-1.5 transition-transform" /> }
                    </button>
                </form>

                <div className="mt-12 pt-10 border-t border-white/5 text-center">
                    <p className="text-slate-400 font-medium">
                        Already a member? 
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold ml-2 transition-colors">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
