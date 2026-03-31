import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('https://hypberlocal-backend.onrender.com/api/auth/login', { 
                email, 
                password,
                role
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] w-full px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 -left-10 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl animate-pulse-slow font-black"></div>
            <div className="absolute bottom-1/4 -right-10 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="glass w-full max-w-lg p-8 sm:p-12 rounded-[2.5rem] relative z-10 animate-float">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 text-emerald-400">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter leading-tight mb-3">
                        Sign <span className="gradient-text">In.</span>
                    </h2>
                    <p className="text-slate-400 font-medium tracking-wide">Enter your credentials to continue</p>
                </div>
                
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl mb-8 text-sm font-semibold flex items-center gap-3 animate-shake">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Role Selection */}
                    <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1 mb-8">
                        {['CUSTOMER', 'SHOPKEEPER', 'DELIVERY'].map(r => (
                            <button 
                                key={r} 
                                type="button" 
                                onClick={() => setRole(r)}
                                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-300 uppercase tracking-[0.2em] ${role === r ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-white/5'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                            <input 
                                type="email" 
                                required 
                                placeholder="name@domain.com"
                                value={email}
                                className="input-field pl-14"
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••"
                                value={password}
                                className="input-field pl-14"
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full mt-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Don't have an account? 
                        <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold ml-2 transition-colors inline-flex items-center gap-1 group">
                            Create Account
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
