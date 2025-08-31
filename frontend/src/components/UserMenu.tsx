'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
    UserIcon,
    ShoppingBagIcon,
    CogIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface UserMenuProps {
    user: any;
    isAdmin: boolean;
}

export function UserMenu({ user, isAdmin }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: UserIcon, label: 'Meu Perfil', href: '/profile' },
        { icon: ShoppingBagIcon, label: 'Meus Pedidos', href: '/orders' },
        { icon: CogIcon, label: 'Configurações', href: '/settings' }
    ];

    // Adicionar item Admin se for administrador
    if (isAdmin) {
        menuItems.unshift({
            icon: ShieldCheckIcon,
            label: 'Painel Admin',
            href: '/admin'
        });
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.firstName?.charAt(0).toUpperCase()}
          </span>
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                        {user.firstName}
                    </p>
                    <p className="text-xs text-gray-500">
                        {isAdmin ? 'Administrador' : 'Cliente'}
                    </p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {isAdmin && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                <ShieldCheckIcon className="w-3 h-3 mr-1" />
                Administrador
              </span>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <item.icon className="w-4 h-4 mr-3 text-gray-400" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}