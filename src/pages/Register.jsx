import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Globe, Map, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({ 
        name: '', email: location.state?.email || '', password: '', confirmPassword: '', phone: '', 
        country: 'India', state: '', address: '', role: 'CUSTOMER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

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
        <div className="flex items-center justify-center min-h-[100vh] w-full px-4 py-20 relative overflow-hidden bg-[#050811]">
             {/* Premium Background Decorative Elements */}
             <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '-3s' }}></div>

            <div className="w-full max-w-3xl relative z-10">
                <div className="text-center mb-12 animate-[fade-in-down_0.8s_ease-out]">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-8 shadow-inner rotate-[-6deg] transition-transform hover:rotate-0 duration-500">
                        <Sparkles size={40} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-4 text-white">
                        Create <br /> <span className="gradient-text">Identity.</span>
                    </h2>
                    <p className="text-slate-400 font-medium tracking-wide opacity-80 max-w-md mx-auto">Initializing your HyperLocal nodes...</p>
                </div>
                
                <div className="glass-card p-10 sm:p-14 rounded-[4rem] animate-float relative group">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[4rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mb-10 text-sm font-semibold flex items-center gap-3 animate-[shake_0.5s_ease-in-out]">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-10">
                        {/* Role Selection - Segment Control Style */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1 opacity-70 text-center block">Access Authority</label>
                            <div className="bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 flex gap-1 relative overflow-hidden max-w-lg mx-auto">
                                {['CUSTOMER', 'SHOPKEEPER', 'DELIVERY'].map(role => (
                                    <button 
                                        key={role} 
                                        type="button" 
                                        onClick={() => setFormData({...formData, role})}
                                        className={`flex-1 py-4 text-[10px] font-black rounded-xl transition-all duration-500 uppercase tracking-widest relative z-10 ${formData.role === role ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {role}
                                        {formData.role === role && (
                                            <div className="absolute inset-0 bg-emerald-600/80 rounded-xl -z-10 shadow-lg shadow-emerald-600/20 animate-[scale-in_0.3s_ease-out]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Legal Name</label>
                                <div className="glass-input">
                                    <div className="flex items-center px-5 h-16">
                                        <User className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input type="text" name="name" required placeholder="Full Name" className="input-field" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Link Terminal (Phone)</label>
                                <div className="glass-input">
                                    <div className="flex items-center px-5 h-16">
                                        <Phone className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input type="text" name="phone" required placeholder="+91 00000 00000" className="input-field" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Region (Country)</label>
                                <div className="glass-input">
                                    <div className="flex items-center px-5 h-16">
                                        <Globe className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input type="text" name="country" required placeholder="India" value={formData.country} className="input-field" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Sector (State)</label>
                                <div className="glass-input">
                                    <div className="flex items-center px-5 h-16">
                                        <Map className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input type="text" name="state" required placeholder="State" className="input-field" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Geographic Coordinates (Address)</label>
                            <div className="glass-input">
                                <div className="flex items-center px-5 h-16">
                                    <MapPin className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                    <input type="text" name="address" required placeholder="House No, Street, Landmark" className="input-field" onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Node Address (Email)</label>
                            <div className="glass-input">
                                <div className="flex items-center px-5 h-16">
                                    <Mail className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                    <input type="email" name="email" required placeholder="user@hyperlocal.net" value={formData.email} className="input-field" onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Access Token (Password)</label>
                                <div className="glass-input">
                                    <div className="flex items-center px-5 h-16">
                                        <Lock className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input type="password" name="password" required placeholder="••••••••" className="input-field" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 ml-1 opacity-70">Authorize Token</label>
                                <div className="glass-input">
                                    <div className="flex items-center px-5 h-16">
                                        <ShieldCheck className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input type="password" name="confirmPassword" required placeholder="••••••••" className="input-field" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full mt-6 py-6 text-xl flex items-center justify-center gap-6 group drop-shadow-emerald"
                        >
                            <span className="font-black uppercase tracking-[0.2em] text-sm sm:text-base">
                                {loading ? 'Initializing...' : 'Confirm Registration'}
                            </span>
                            {!loading && <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-300" /> }
                        </button>
                    </form>

                    <div className="mt-14 pt-12 border-t border-white/10 text-center">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                            Existing Entity? 
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-black ml-4 transition-all inline-flex items-center gap-2 group/link">
                                Access Account
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
