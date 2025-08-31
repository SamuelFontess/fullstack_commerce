'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, toast.duration || 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`relative p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
                            toast.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' :
                                toast.type === 'error' ? 'bg-red-100 border border-red-200 text-red-800' :
                                    toast.type === 'warning' ? 'bg-yellow-100 border border-yellow-200 text-yellow-800' :
                                        'bg-blue-100 border border-blue-200 text-blue-800'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium">{toast.title}</h4>
                                {toast.message && <p className="text-sm mt-1">{toast.message}</p>}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-4 text-gray-500 hover:text-gray-700 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}