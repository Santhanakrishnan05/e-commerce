import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const { user, loading } = useAuth();

    // Load cart and favorites from localStorage when user changes
    useEffect(() => {
        // Don't clear cart/favorites while auth is still loading
        if (loading) return;
        
        // Reset loaded flag when user changes
        setHasLoaded(false);
        
        if (user) {
            const userId = user._id || user.userId;
            const savedCart = localStorage.getItem(`cart-${userId}`);
            const savedFavorites = localStorage.getItem(`favorites-${userId}`);
            
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (error) {
                    console.error('Error parsing cart data:', error);
                    setCart([]);
                }
            }
            if (savedFavorites) {
                try {
                    setFavorites(JSON.parse(savedFavorites));
                } catch (error) {
                    console.error('Error parsing favorites data:', error);
                    setFavorites([]);
                }
            }
        } else {
            // Only clear if we're sure there's no user (not just loading)
            setCart([]);
            setFavorites([]);
        }
        
        // Mark as loaded after processing
        setHasLoaded(true);
    }, [user, loading]);

    // Save cart and favorites to localStorage when they change
    useEffect(() => {
        // Only save after we've loaded the initial data
        if (user && !loading && hasLoaded) {
            const userId = user._id || user.userId;
            localStorage.setItem(`cart-${userId}`, JSON.stringify(cart));
            localStorage.setItem(`favorites-${userId}`, JSON.stringify(favorites));
        }
    }, [cart, favorites, user, loading, hasLoaded]);

    const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        const productId = product._id || product.id;
        if (!productId) {
            console.error('Product missing ID:', product);
            return;
        }

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => (item._id || item.id) === productId && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
            );

            if (existingItemIndex > -1) {
                // Update existing item quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            } else {
                // Add new item
                return [...prevCart, {
                    ...product,
                    _id: productId,
                    id: productId, // Keep both for compatibility
                    quantity,
                    selectedSize,
                    selectedColor
                }];
            }
        });
    };

    const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
        setCart(prevCart => 
            prevCart.filter(item => 
                !((item._id || item.id) === productId && 
                  item.selectedSize === selectedSize && 
                  item.selectedColor === selectedColor)
            )
        );
    };

    const updateCartItemQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
        if (quantity <= 0) {
            removeFromCart(productId, selectedSize, selectedColor);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                (item._id || item.id) === productId && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        setFavorites([]);
    };

    const addToFavorites = (product) => {
        if (!user) {
            alert('Please login to add items to favorites');
            return;
        }

        const productId = product._id || product.id;
        if (!productId) {
            console.error('Product missing ID:', product);
            return;
        }

        setFavorites(prevFavorites => {
            const exists = prevFavorites.some(item => (item._id || item.id) === productId);
            if (!exists) {
                return [...prevFavorites, {
                    ...product,
                    _id: productId,
                    id: productId // Keep both for compatibility
                }];
            }
            return prevFavorites;
        });
    };

    const removeFromFavorites = (productId) => {
        setFavorites(prevFavorites => 
            prevFavorites.filter(item => (item._id || item.id) !== productId)
        );
    };

    const isInFavorites = (productId) => {
        return favorites.some(item => (item._id || item.id) === productId);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.discountPrice || item.originalPrice;
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        getCartTotal,
        getCartItemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
