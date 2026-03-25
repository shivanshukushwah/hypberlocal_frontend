import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, MapPin, Phone, Save } from 'lucide-react';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', country: '', state: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Fetch full profile from backend
        axios.get('https://hypberlocal-backend.onrender.com/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const u = res.data.user;
            setFormData({
                name: u.name || '', email: u.email || '', phone: u.phone || '', 
                address: u.address || '', country: u.country || '', state: u.state || ''
            });
        }).catch(() => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://hypberlocal-backend.onrender.com/api/auth/sync-profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('user', JSON.stringify(res.data.user)); 
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full animate-[fade-in_0.3s_ease-out]">
            <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-400 to-blue-500 opacity-20"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 -mt-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white text-teal-600">
                        <UserCircle size={64} />
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-800">{formData.name || 'Your Profile'}</h2>
                        <p className="text-slate-500 font-medium">Manage your personal information</p>
                    </div>
                </div>

                {message && <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${message.includes('success') ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address (Read-Only)</label>
                            <input type="email" readOnly value={formData.email} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium text-slate-400 cursor-not-allowed" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Phone size={14}/> Phone Number</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700" placeholder="+91 9876543210"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={14}/> Street Address</label>
                            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700" placeholder="123 Main St, Apt 4B"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">State</label>
                            <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700" placeholder="Delhi"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                            <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700" placeholder="India"/>
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full sm:w-auto px-8 py-3.5 mt-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:-translate-y-0.5 shadow-lg hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-2">
                        <Save size={20} /> {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
