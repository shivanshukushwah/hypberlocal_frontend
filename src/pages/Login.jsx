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
        <div className="flex items-center justify-center min-h-[100vh] w-full px-4 relative overflow-hidden bg-[#050811]">
            {/* Premium Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '-4s' }}></div>
            
            {/* Content Container */}
            <div className="w-full max-w-md relative z-10 py-12">
                <div className="text-center mb-10 animate-[fade-in-down_0.8s_ease-out]">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-8 shadow-inner shadow-emerald-500/5 rotate-12 transition-transform hover:rotate-0 duration-500">
                        <ShieldCheck size={40} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h2 className="text-5xl font-black tracking-tight leading-none mb-4 text-white">
                        Access <br /> <span className="gradient-text">Portal.</span>
                    </h2>
                    <p className="text-slate-400 font-medium tracking-wide opacity-80">Syncing with HyperLocal node...</p>
                </div>
                
                <div className="glass-card p-10 sm:p-12 rounded-[3.5rem] animate-float relative group">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[3.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl mb-8 text-sm font-semibold flex items-center gap-3 animate-[shake_0.5s_ease-in-out]">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        {/* Role Selection - Segment Control Style */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1 opacity-70">Identity Authority</label>
                            <div className="bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 flex gap-1 relative overflow-hidden">
                                {['CUSTOMER', 'SHOPKEEPER', 'DELIVERY'].map(r => (
                                    <button 
                                        key={r} 
                                        type="button" 
                                        onClick={() => setRole(r)}
                                        className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-500 uppercase tracking-widest relative z-10 ${role === r ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {r}
                                        {role === r && (
                                            <div className="absolute inset-0 bg-emerald-600/80 rounded-xl -z-10 shadow-lg shadow-emerald-600/20 animate-[scale-in_0.3s_ease-out]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1 opacity-70">Decryption Key (Email)</label>
                            <div className="glass-input group">
                                <div className="flex items-center px-5 h-16">
                                    <Mail className="text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" size={20} />
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder="user@hyperlocal.net"
                                        value={email}
                                        className="input-field"
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-70">Authentication Token</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-[0.2em] transition-colors">Recover?</Link>
                            </div>
                            <div className="glass-input group">
                                <div className="flex items-center px-5 h-16">
                                    <Lock className="text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" size={20} />
                                    <input 
                                        type="password" 
                                        required 
                                        placeholder="••••••••"
                                        value={password}
                                        className="input-field"
                                        onChange={e => setPassword(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full mt-4 flex items-center justify-center gap-4 text-lg group drop-shadow-emerald"
                        >
                            <span className="font-black uppercase tracking-widest text-sm">
                                {loading ? 'Authorizing...' : 'Establish Link'}
                            </span>
                            {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-white/10 text-center">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            New Identity? 
                            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-black ml-3 transition-all inline-flex items-center gap-2 group/link">
                                Initialize Account
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
