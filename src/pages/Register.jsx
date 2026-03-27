import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Phone, MapPin, KeyRound, Globe, Map } from 'lucide-react';
const Register = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({ 
        name: '', email: location.state?.email || '', password: '', phone: '', 
        country: '', state: '', address: '', role: 'CUSTOMER', otp: ''
    });
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSendOTP = async e => {
        e.preventDefault();
        setError('');
        setMessage('Sending OTP...');
        try {
            await axios.post('https://hypberlocal-backend.onrender.com/api/auth/send-otp', { email: formData.email });
            setMessage('OTP sent to email. Please verify to complete registration.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setMessage('');
        }
    };

    const handleVerifyRegister = async e => {
        e.preventDefault();
        setError('');
        setMessage('Verifying your OTP...');
        try {
            const res = await axios.post('https://hypberlocal-backend.onrender.com/api/auth/verify-otp', {
                email: formData.email,
                otp: formData.otp,
                registrationData: { ...formData }
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP Verification failed');
            setMessage('');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[85vh] w-full px-4 sm:px-0 py-8 animate-[fade-in_0.5s_ease-out]">
            <div className="glass w-full max-w-xl p-6 sm:p-10 rounded-3xl shadow-2xl shadow-teal-500/5 border border-white/60">
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        Create <span className="gradient-text">Account.</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Join the local commerce revolution</p>
                </div>
                
                {error && <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold flex items-center shadow-sm animate-shake">{error}</div>}
                {message && <div className="bg-teal-50 border border-teal-100 text-teal-600 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold flex items-center shadow-sm">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-5">
                        {/* Identify Role */}
                        <div className="bg-slate-50 p-1 rounded-2xl border border-slate-100 flex gap-1 mb-2">
                            {['CUSTOMER', 'SHOPKEEPER', 'DELIVERY'].map(role => (
                                <button key={role} type="button" onClick={() => setFormData({...formData, role})}
                                    className={`flex-1 py-2 text-[10px] sm:text-xs font-black rounded-xl transition-all uppercase tracking-widest ${formData.role === role ? 'bg-white text-teal-600 shadow-sm border border-teal-100' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">Full Name</label>
                                <User className="absolute left-4 top-[32px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                                <input type="text" name="name" required placeholder="John Doe"
                                       className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                       onChange={handleChange} />
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">Mobile</label>
                                <Phone className="absolute left-4 top-[32px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                                <input type="text" name="phone" required placeholder="+91 0000000000"
                                       className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                       onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">Country</label>
                                <Globe className="absolute left-4 top-[32px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                                <input type="text" name="country" required placeholder="India"
                                       className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                       onChange={handleChange} />
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">State</label>
                                <Map className="absolute left-4 top-[32px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                                <input type="text" name="state" required placeholder="New Delhi"
                                       className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                       onChange={handleChange} />
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">Complete Address</label>
                            <MapPin className="absolute left-4 top-[32px] text-slate-400" size={16} />
                            <input type="text" name="address" required placeholder="House No, Street, Landmark"
                                   className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                   onChange={handleChange} />
                        </div>

                        <div className="relative group w-full">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">Login Email</label>
                            <Mail className="absolute left-4 top-[32px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                            <input type="email" name="email" required placeholder="name@email.com" value={formData.email}
                                   className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                   onChange={handleChange} />
                        </div>

                        <div className="relative group w-full">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block">New Password</label>
                            <Lock className="absolute left-4 top-[32px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                            <input type="password" name="password" required placeholder="••••••••"
                                   className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-sm font-medium shadow-sm"
                                   onChange={handleChange} />
                        </div>

                        <button type="submit" className="w-full mt-4 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-extrabold text-base sm:text-lg hover-scale shadow-lg shadow-teal-500/20 active:scale-95 transition-transform">
                            Create Account
                        </button>
                    </form>
                )}

                {step === 2 && (
                     <form onSubmit={handleVerifyRegister} className="space-y-6">
                        <div className="text-slate-500 text-xs sm:text-sm mb-4 text-center bg-slate-50 py-3 rounded-xl border border-slate-100 italic px-2">
                            Check <span className="text-slate-800 font-extrabold">{formData.email}</span> for the 6-digit verification code.
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1.5 block">Security Code</label>
                            <KeyRound className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                            <input type="text" name="otp" required placeholder="••••••" maxLength="6"
                                   className="w-full tracking-[0.5em] text-center text-2xl font-black bg-white border border-slate-200 rounded-2xl py-3 sm:py-3.5 px-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all shadow-sm"
                                   onChange={handleChange} />
                        </div>
                        <button type="submit" className="w-full mt-2 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-extrabold text-base sm:text-lg hover-scale shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            Verify & Get Started
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-tight">
                        Already have an account? <Link to="/login" className="text-teal-500 hover:text-teal-600 transition-colors ml-1">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
