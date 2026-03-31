import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Landmark, ArrowUpRight, History, CheckCircle2, Clock, XCircle } from 'lucide-react';

const WalletPage = () => {
    const [balanceData, setBalanceData] = useState({ balance: 0, pendingWithdrawal: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawForm, setWithdrawForm] = useState({ amount: '', accountName: '', accountNumber: '', ifscCode: '' });
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const fetchWalletData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [balRes, histRes] = await Promise.all([
                axios.get('https://hypberlocal-backend.onrender.com/api/wallet/balance', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('https://hypberlocal-backend.onrender.com/api/wallet/history', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setBalanceData(balRes.data);
            setHistory(histRes.data);
        } catch (error) {
            console.error("Failed to fetch wallet data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(withdrawForm.amount);
        if (amountNum < 100) return alert('Minimum withdrawal is ₹100');
        if (amountNum > balanceData.balance) return alert('Insufficient balance');

        setIsWithdrawing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://hypberlocal-backend.onrender.com/api/wallet/withdraw', {
                amount: amountNum,
                bankDetails: {
                    accountName: withdrawForm.accountName,
                    accountNumber: withdrawForm.accountNumber,
                    ifscCode: withdrawForm.ifscCode
                }
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert('Withdrawal request submitted successfully!');
            setWithdrawForm({ amount: '', accountName: '', accountNumber: '', ifscCode: '' });
            fetchWalletData();
        } catch (error) {
            alert('Failed to submit withdrawal: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-indigo-600 font-bold animate-pulse">Loading secure wallet...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg">
                    <Wallet className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Earnings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm mb-2 opacity-80">Available Balance</p>
                    <h3 className="text-5xl font-black mb-8">₹{balanceData.balance.toFixed(2)}</h3>
                    
                    <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex justify-between items-center">
                        <span className="text-indigo-100 font-semibold text-sm">Pending Withdrawals:</span>
                        <span className="font-bold">₹{balanceData.pendingWithdrawal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Withdraw Form */}
                <div className="glass p-8 rounded-[2.5rem] border border-indigo-50 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
                        <Landmark className="text-indigo-500" size={20} /> Request Withdrawal
                    </h3>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" placeholder="Amount (₹)" required min="100" max={balanceData.balance}
                                className="col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm"
                                value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                            />
                            <input type="text" placeholder="Account Holder Name" required 
                                className="col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm"
                                value={withdrawForm.accountName} onChange={e => setWithdrawForm({...withdrawForm, accountName: e.target.value})}
                            />
                            <input type="text" placeholder="Account Number" required 
                                className="bg-slate-50 border border-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm truncate"
                                value={withdrawForm.accountNumber} onChange={e => setWithdrawForm({...withdrawForm, accountNumber: e.target.value})}
                            />
                            <input type="text" placeholder="IFSC Code" required 
                                className="bg-slate-50 border border-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm uppercase"
                                value={withdrawForm.ifscCode} onChange={e => setWithdrawForm({...withdrawForm, ifscCode: e.target.value.toUpperCase()})}
                            />
                        </div>
                        <button type="submit" disabled={isWithdrawing || balanceData.balance < 100} className="w-full py-4 rounded-xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex justify-center items-center gap-2 mt-4">
                            <ArrowUpRight size={18} /> {isWithdrawing ? 'Processing...' : 'Transfer to Bank'}
                        </button>
                    </form>
                </div>
            </div>

            {/* History Table */}
            <div className="glass p-8 rounded-[2.5rem] border border-indigo-50 shadow-sm mt-8">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
                    <History className="text-indigo-500" size={20} /> Transaction History
                </h3>
                {history.length === 0 ? (
                    <p className="text-slate-400 text-center py-8 font-medium">No withdrawal history available.</p>
                ) : (
                    <div className="space-y-4">
                        {history.map(req => (
                            <div key={req._id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                                <div>
                                    <h4 className="font-bold text-slate-800">Withdrawal to Bank</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AC: {req.bankDetails?.accountNumber?.slice(-4).padStart(8, '*')} • {new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 mb-1">₹{req.amount}</p>
                                    {req.status === 'PENDING' && <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-widest"><Clock size={12}/> Pending</span>}
                                    {req.status === 'COMPLETED' && <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-full uppercase tracking-widest"><CheckCircle2 size={12}/> Success</span>}
                                    {req.status === 'REJECTED' && <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase tracking-widest"><XCircle size={12}/> Failed</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletPage;
