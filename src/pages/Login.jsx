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
        <div className="flex items-center justify-center min-h-[80vh] w-full mt-8">
            <div className="glass-dark w-full max-w-md p-10 rounded-3xl animate-[fade-in_0.5s_ease-out]">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold gradient-text inline-block mb-3">Welcome Back</h2>
                    <p className="text-slate-400 text-sm font-medium">Passwordless Login powered by Supabase</p>
                </div>
                
                {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">{error}</div>}
                {message && <div className="bg-teal-500/10 border border-teal-500/30 text-teal-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={20} />
                            <input type="email" required placeholder="Email Address"
                                   value={email}
                                   className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
                                   onChange={e => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg hover-scale shadow-[0_0_20px_rgba(20,184,166,0.25)] flex items-center justify-center gap-2 border border-white/10">
                            <LogIn size={20} /> Send Login OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                        <div className="text-slate-300 text-sm mb-4 text-center">
                            OTP sent to <strong>{email}</strong>
                            <button type="button" onClick={() => setStep(1)} className="ml-2 text-teal-400 hover:text-teal-300 text-xs">Change</button>
                        </div>
                        <div className="relative group">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={20} />
                            <input type="text" required placeholder="Enter 6-digit OTP" maxLength="6"
                                   value={otp}
                                   className="w-full tracking-widest text-center text-2xl font-mono bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
                                   onChange={e => setOtp(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg hover-scale shadow-[0_0_20px_rgba(20,184,166,0.25)] flex items-center justify-center gap-2 border border-white/10">
                            Verify & Sign In
                        </button>
                        <button type="button" onClick={handleSendOTP} className="w-full text-slate-400 hover:text-white mt-2 text-sm font-medium transition-colors">
                            Resend OTP
                        </button>
                    </form>
                )}

                <p className="text-center text-slate-400 mt-8 text-sm font-medium">
                    Don't have an account? <Link to="/register" className="text-teal-400 font-bold hover:text-teal-300 tracking-wide transition-colors">Join now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
