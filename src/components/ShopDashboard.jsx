import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Store, Plus, Package, ShoppingBag, X, Camera, ScanLine, CheckCircle2 } from 'lucide-react';
import Webcam from 'react-webcam';

const ShopDashboard = () => {
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [formData, setFormData] = useState({ shopName: '', description: '', address: '', latitude: '28.6139', longitude: '77.2090' });
    const [productForm, setProductForm] = useState({ name: '', category: 'MEN', price: '', description: '', sizesAvailable: 'S,M,L,XL', imageUrl: '' });
    
    // Smart Scanner States
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const webcamRef = useRef(null);

    const fetchShopAndProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/shops/my-shop', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShop(res.data);
            
            const prodRes = await axios.get(`http://localhost:5000/api/products?shopId=${res.data._id}`);
            setProducts(prodRes.data);
            
            const ordersRes = await axios.get('https://hypberlocal-backend.onrender.com/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(ordersRes.data);
        } catch (error) {
            setShop(null);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://hypberlocal-backend.onrender.com/api/orders/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchShopAndProducts();
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    useEffect(() => {
        fetchShopAndProducts();
    }, []);

    const handleCreateShop = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/shops', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchShopAndProducts();
        } catch (error) {
            alert('Failed to create shop');
        }
    };

    const captureAndScan = useCallback((e) => {
        e.preventDefault();
        setIsScanning(true);
        // Simulate deep smart scanning animation delay
        setTimeout(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            setProductForm(prev => ({ ...prev, imageUrl: imageSrc }));
            setIsScanning(false);
            setIsCameraOpen(false);
        }, 1800);
    }, [webcamRef]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/products', {
                ...productForm,
                sizesAvailable: productForm.sizesAvailable.split(',')
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddProduct(false);
            setProductForm({ name: '', category: 'MEN', price: '', description: '', sizesAvailable: 'S,M,L,XL', imageUrl: '' });
            fetchShopAndProducts(); 
        } catch (error) {
            alert('Failed to add product');
        }
    };

    if (loading) return <div className="p-12 text-center text-teal-600 font-bold animate-pulse">Loading dashboard...</div>;

    if (!shop) {
        return (
            <div className="glass p-8 md:p-12 rounded-3xl max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store size={32} />
                    </div>
                    <h3 className="text-3xl font-bold gradient-text">Open Your Digital Store</h3>
                    <p className="text-slate-500 mt-2">Register your physical shop to start receiving local orders today.</p>
                </div>
                
                <form onSubmit={handleCreateShop} className="space-y-4">
                    <input type="text" placeholder="Shop Name" required className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, shopName: e.target.value})} />
                    <textarea placeholder="Brief Description (e.g., Men's Premium Wear)" className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    <input type="text" placeholder="Full Address" required className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, address: e.target.value})} />
                    
                    <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-lg hover-scale shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 mt-6">
                        <Plus size={20} /> Launch My Shop
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div className="glass p-8 rounded-3xl border-l-4 border-l-indigo-500 flex justify-between items-center bg-white/60">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">{shop.shopName}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><Store size={14}/> Status: <span className="font-bold text-teal-600">{shop.status}</span></p>
                </div>
                <button onClick={() => setShowAddProduct(!showAddProduct)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover-scale shadow-md flex items-center gap-2">
                    {showAddProduct ? <X size={16} /> : <Plus size={16} />} 
                    {showAddProduct ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {showAddProduct && (
                 <div className="glass p-8 rounded-3xl animate-[fade-in_0.3s_ease-out]">
                    <h4 className="text-xl font-bold text-slate-700 mb-6">Create New Listing</h4>
                    
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                        
                        {/* Smart Scanner Button Area */}
                        <div className="md:col-span-2 mb-2">
                            {productForm.imageUrl ? (
                                <div className="relative w-full h-56 rounded-2xl overflow-hidden border-2 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                                    <img src={productForm.imageUrl} alt="Scanned Product" className="w-full h-full object-contain bg-slate-100" />
                                    <div className="absolute top-2 right-2 bg-teal-500 text-white p-1.5 flex items-center gap-1 rounded-full text-xs font-bold shadow"><CheckCircle2 size={16} /> Scanned</div>
                                    <button type="button" onClick={() => setProductForm({...productForm, imageUrl: ''})} className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-rose-500 transition-colors">Retake / Rescan</button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => setIsCameraOpen(true)} className="w-full py-10 border-2 border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50/80 rounded-2xl flex flex-col items-center justify-center gap-3 text-indigo-500 transition-all hover:border-indigo-400 group">
                                    <div className="p-4 bg-indigo-100/50 rounded-full group-hover:scale-110 transition-transform">
                                        <Camera size={38} className="text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-extrabold text-lg text-slate-700">Open Smart Scanner</span>
                                        <span className="text-sm text-slate-500 font-medium mt-1">Capture a photo or short video to auto-scan items.</span>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Standard Details */}
                        <input type="text" placeholder="Product Name" required className="bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" onChange={e => setProductForm({...productForm, name: e.target.value})} defaultValue={productForm.name} />
                        <select className="bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none font-medium" onChange={e => setProductForm({...productForm, category: e.target.value})} defaultValue={productForm.category}>
                            <option value="MEN">Mens Collection</option>
                            <option value="WOMEN">Womens Collection</option>
                            <option value="KIDS">Kids & Baby</option>
                        </select>
                        <input type="number" placeholder="Price (₹)" required className="bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none font-medium" onChange={e => setProductForm({...productForm, price: e.target.value})} defaultValue={productForm.price} />
                        <input type="text" placeholder="Sizes Available (e.g. S,M,L)" required className="bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none font-medium" onChange={e => setProductForm({...productForm, sizesAvailable: e.target.value})} defaultValue={productForm.sizesAvailable} />
                        <textarea placeholder="Write a short description..." className="md:col-span-2 bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none font-medium min-h-[100px]" onChange={e => setProductForm({...productForm, description: e.target.value})} defaultValue={productForm.description}></textarea>
                        
                        <button type="submit" disabled={!productForm.imageUrl} className="md:col-span-2 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            Publish Listing
                        </button>
                    </form>

                    {/* Camera Modal Overlay */}
                    {isCameraOpen && (
                        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col p-4 animate-[fade-in_0.2s_ease-out]">
                            <div className="flex justify-between items-center w-full max-w-lg mx-auto mb-4 mt-8">
                                <h3 className="text-white font-bold text-xl flex items-center gap-2"><ScanLine className="text-teal-400"/> Product Scanner</h3>
                                <button onClick={() => setIsCameraOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl w-full max-w-lg mx-auto relative border border-slate-700 flex-grow max-h-[60vh]">
                                <Webcam 
                                    audio={false} 
                                    ref={webcamRef} 
                                    screenshotFormat="image/jpeg" 
                                    videoConstraints={{ facingMode: "environment" }}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-50' : 'opacity-100'}`}
                                />
                                
                                {/* Smart Scan Reticle Overlay */}
                                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
                                    <div className="w-full h-full border-[3px] border-white/30 rounded-2xl relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
                                        <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"></div>
                                        <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"></div>
                                        <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"></div>
                                        <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-teal-400 rounded-br-xl"></div>
                                        
                                        {/* CSS Laser Animation */}
                                        {isScanning && <div className="absolute inset-x-0 h-1 bg-teal-400 shadow-[0_0_15px_#2dd4bf] scanner-laser"></div>}
                                    </div>
                                </div>
                                
                                {isScanning && (
                                    <div className="absolute inset-0 bg-teal-500/10 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
                                        <div className="bg-slate-900 text-teal-400 px-6 py-3 rounded-full font-bold flex items-center gap-2 border border-teal-500/50 shadow-2xl scale-110">
                                            <ScanLine className="animate-pulse" /> Identifying Attributes...
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 text-center w-full max-w-lg mx-auto mt-auto mb-8">
                                <p className="text-slate-400 text-sm mb-6 font-medium">Position the clothing completely inside the frame.</p>
                                <button onClick={captureAndScan} disabled={isScanning} className="w-full py-5 rounded-full bg-white text-slate-900 font-extrabold text-lg flex justify-center items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 hover:bg-slate-100">
                                    <Camera size={24} /> {isScanning ? 'Processing Image...' : 'Auto-Scan && Capture'}
                                </button>
                            </div>
                        </div>
                    )}
                 </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Product Inventory List */}
                 <div className="lg:col-span-2 glass p-8 rounded-3xl min-h-[300px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Package className="text-indigo-500" size={24} />
                        <h4 className="text-xl font-bold text-slate-700">Inventory ({products.length})</h4>
                    </div>
                    {products.length === 0 ? (
                        <p className="text-slate-400 text-center py-12 font-medium">You haven't added any products yet. Click 'Add Product' to start building your catalog.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map(p => (
                                <div key={p._id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                        {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200"></div>}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 line-clamp-1">{p.name}</h5>
                                        <p className="text-xs text-slate-400 font-bold tracking-wide">{p.category} • <span className="text-teal-600">₹{p.price}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>

                 {/* Live Orders View */}
                 <div className="glass p-8 rounded-3xl min-h-[300px] border border-dashed border-indigo-200">
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingBag className="text-indigo-500" size={24} />
                        <h4 className="text-xl font-bold text-slate-700">Live Orders ({orders.length})</h4>
                    </div>
                    {orders.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-12">No new orders right now.</p>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 flex flex-col">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h5 className="font-bold text-slate-800">{order.customerId?.name || 'Customer'}</h5>
                                            <p className="text-xs text-slate-500 font-semibold">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • ₹{order.totalAmount}</p>
                                        </div>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="bg-indigo-50 text-indigo-700 border-none rounded-lg text-xs font-bold py-1.5 px-2 focus:ring-0 cursor-pointer shadow-sm"
                                        >
                                            <option value="PLACED">Placed</option>
                                            <option value="PREPARING">Preparing</option>
                                            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                            <option value="DELIVERED">Delivered</option>
                                        </select>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-600 mt-3 pt-3 border-t border-slate-50 space-y-1">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-slate-500">
                                                <span>{item.quantity}x Size {item.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default ShopDashboard;
