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
        <div className="flex items-center justify-center min-h-[85vh] w-full py-8">
            <div className="glass-dark w-full max-w-xl p-10 rounded-3xl animate-[fade-in_0.5s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold gradient-text inline-block mb-3">Create Account</h2>
                    <p className="text-slate-400 text-sm font-medium">Join HyperLocal to discover your neighborhood</p>
                </div>
                
                {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
                {message && <div className="bg-teal-500/10 border border-teal-500/30 text-teal-400 px-4 py-3 rounded-xl mb-6 text-sm">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input type="text" name="name" required placeholder="Full Name"
                                       className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                       onChange={handleChange} />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input type="text" name="phone" required placeholder="Mobile Number"
                                       className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                       onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input type="text" name="country" required placeholder="Country"
                                       className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                       onChange={handleChange} />
                            </div>
                            <div className="relative group">
                                <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input type="text" name="state" required placeholder="State / Province"
                                       className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                       onChange={handleChange} />
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input type="text" name="address" required placeholder="Full Address"
                                   className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                   onChange={handleChange} />
                        </div>

                        <div className="relative group w-full">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                            <input type="email" name="email" required placeholder="Email Address" value={formData.email}
                                   className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                   onChange={handleChange} />
                        </div>

                        <div className="relative group w-full">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                            <input type="password" name="password" required placeholder="Password"
                                   className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-sm"
                                   onChange={handleChange} />
                        </div>
                        
                        <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 mt-2">
                            {['CUSTOMER', 'SHOPKEEPER', 'DELIVERY'].map(role => (
                                <button key={role} type="button" onClick={() => setFormData({...formData, role})}
                                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${formData.role === role ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                                    {role}
                                </button>
                            ))}
                        </div>

                        <button type="submit" className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg hover-scale shadow-[0_0_20px_rgba(20,184,166,0.25)] flex items-center justify-center gap-2 border border-white/10">
                            <Mail size={20} /> Send OTP Validation Email
                        </button>
                    </form>
                )}

                {step === 2 && (
                     <form onSubmit={handleVerifyRegister} className="space-y-5">
                        <div className="text-slate-300 text-sm mb-4 text-center">
                            An OTP has been sent to <strong>{formData.email}</strong> by Supabase Auth!
                        </div>
                        <div className="relative group">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={20} />
                            <input type="text" name="otp" required placeholder="Enter 6-digit OTP" maxLength="6"
                                   className="w-full tracking-widest text-center text-2xl font-mono bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
                                   onChange={handleChange} />
                        </div>
                        <button type="submit" className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg hover-scale shadow-[0_0_20px_rgba(20,184,166,0.25)] flex items-center justify-center gap-2 border border-white/10">
                            Verify & Start
                        </button>
                    </form>
                )}

                <p className="text-center text-slate-400 mt-8 text-sm font-medium">
                    Already have an account? <Link to="/login" className="text-teal-400 font-bold hover:text-teal-300 tracking-wide transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
