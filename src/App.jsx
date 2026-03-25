import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CustomerOrders from './pages/CustomerOrders';
import Profile from './pages/Profile';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative w-full overflow-hidden bg-slate-50">
          {/* Subtle background abstract shapes for maximum aesthetics */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 relative z-10 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop/:id" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<CustomerOrders />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
