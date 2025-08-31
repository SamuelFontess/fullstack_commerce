'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/types';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalValue: number;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    isCartAccessible: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();

    // Carregar carrinho do localStorage quando usuário faz login
    useEffect(() => {
        if (user) {
            const savedCart = localStorage.getItem(`cart_${user.id}`);
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            }
        } else {
            // Limpar carrinho quando usuário faz logout
            setItems([]);
        }
    }, [user]);

    // Salvar carrinho no localStorage sempre que mudar
    useEffect(() => {
        if (user && items.length > 0) {
            localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
        }
    }, [items, user]);

    const addItem = (product: Product) => {
        if (!user) {
            // Redirecionar para login se não estiver logado
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeItem = (productId: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        if (user) {
            localStorage.removeItem(`cart_${user.id}`);
        }
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isCartAccessible = !!user; // Só pode acessar carrinho se estiver logado

    return (
        <CartContext.Provider value={{
            items,
            totalItems,
            totalValue,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isCartAccessible
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};