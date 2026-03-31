import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App } from '@capacitor/app';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CustomerOrders from './pages/CustomerOrders';
import Profile from './pages/Profile';
import WalletPage from './pages/WalletPage';
import { CartProvider } from './context/CartContext';

function AppContent() {
  useEffect(() => {
    const handleBackButton = async () => {
      // If we are at the root, we can exit the app or just do nothing
      // For now, let's just use window.history.back() to navigate within the app
      if (window.location.pathname === '/') {
        // Option to exit or minimize if needed
        // App.exitApp();
      } else {
        window.history.back();
      }
    };

    const backListener = App.addListener('backButton', handleBackButton);

    return () => {
      backListener.then(l => l.remove());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-hidden bg-[#050811] text-slate-200">
      {/* Premium background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 w-full max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop/:id" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Routes>
      </main>
    </div>
  );
}

function AppComp() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default AppComp;
