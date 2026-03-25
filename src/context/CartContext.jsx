import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('hyperlocal_cart');
        return savedCart ? JSON.parse(savedCart) : { shopId: null, shopName: null, items: [], totalAmount: 0 };
    });

    useEffect(() => {
        localStorage.setItem('hyperlocal_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, shopId, shopName, quantity = 1, size = null) => {
        setCart(prevCart => {
            // One shop per order constraint for simplicity
            if (prevCart.shopId && prevCart.shopId !== shopId && prevCart.items.length > 0) {
                alert(`Your cart contains items from ${prevCart.shopName}. Please clear your cart to buy from this shop.`);
                return prevCart; 
            }

            const existingItemIndex = prevCart.items.findIndex(item => item.product._id === product._id && item.size === size);
            
            let newItems = [...prevCart.items];
            if (existingItemIndex > -1) {
                newItems[existingItemIndex].quantity += quantity;
            } else {
                newItems.push({ product, quantity, size, price: product.price });
            }

            const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                shopId: shopId,
                shopName: shopName,
                items: newItems,
                totalAmount: newTotal
            };
        });
    };

    const removeFromCart = (productId, size) => {
        setCart(prevCart => {
            const newItems = prevCart.items.filter(item => !(item.product._id === productId && item.size === size));
            const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return {
                ...prevCart,
                items: newItems,
                totalAmount: newTotal,
                shopId: newItems.length === 0 ? null : prevCart.shopId,
                shopName: newItems.length === 0 ? null : prevCart.shopName
            };
        });
    };

    const clearCart = () => {
        setCart({ shopId: null, shopName: null, items: [], totalAmount: 0 });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
