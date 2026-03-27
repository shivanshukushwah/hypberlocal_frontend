import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, KeyRound, LogIn } from 'lucide-react';
const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('Sending OTP...');
        try {
            await axios.post('https://hypberlocal-backend.onrender.com/api/auth/send-otp', { email });
            setMessage('OTP sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
            setMessage('');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('Verifying your OTP...');
        try {
            const res = await axios.post('https://hypberlocal-backend.onrender.com/api/auth/verify-otp', {
                email,
                otp
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP Verification failed');
            setMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[75vh] w-full px-4 sm:px-0 animate-[fade-in_0.5s_ease-out]">
            <div className="glass w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl shadow-teal-500/5 border border-white/60">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        Welcome <span className="gradient-text">Back.</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Fast, secure, and passwordless.</p>
                </div>
                
                {error && <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold flex items-center shadow-sm animate-shake">{error}</div>}
                {message && <div className="bg-teal-50 border border-teal-100 text-teal-600 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold flex items-center shadow-sm">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-6">
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1.5 block">Email Identity</label>
                            <Mail className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                            <input type="email" required placeholder="name@email.com"
                                   value={email}
                                   className="w-full bg-white border border-slate-200 rounded-2xl py-3 sm:py-3.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all font-medium text-sm sm:text-base shadow-sm"
                                   onChange={e => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full mt-2 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-extrabold text-base sm:text-lg hover-scale shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            Send Login OTP <LogIn size={18} />
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6">
                        <div className="text-slate-500 text-xs sm:text-sm mb-4 text-center bg-slate-50 py-2 rounded-xl border border-slate-100 italic">
                            OTP sent to <span className="text-slate-800 font-bold">{email}</span>
                            <button type="button" onClick={() => setStep(1)} className="ml-2 text-teal-600 font-bold hover:underline">Edit</button>
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1.5 block">6-Digit Key</label>
                            <KeyRound className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                            <input type="text" required placeholder="••••••" maxLength="6"
                                   value={otp}
                                   className="w-full tracking-[0.5em] text-center text-2xl font-black bg-white border border-slate-200 rounded-2xl py-3 sm:py-3.5 px-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all shadow-sm"
                                   onChange={e => setOtp(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full mt-2 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-extrabold text-base sm:text-lg hover-scale shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            Verify & Sign In
                        </button>
                        <button type="button" onClick={handleSendOTP} className="w-full text-slate-400 hover:text-teal-600 mt-2 text-xs sm:text-sm font-bold transition-colors">
                            Did not receive OTP? Resend
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-tight">
                        New to neighborhood? <Link to="/register" className="text-teal-500 hover:text-teal-600 transition-colors ml-1">Join HyperLocal</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
