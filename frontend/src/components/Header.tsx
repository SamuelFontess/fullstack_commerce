'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/SearchBar';
import { UserMenu } from '@/components/UserMenu';
import { MobileMenu } from '@/components/MobileMenu';
import {
    ShoppingCartIcon,
    Bars3Icon,
    UserIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import {formatPrice} from "@/lib/utils";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const { totalItems, totalValue } = useCart();
    const { isAdmin } = usePermissions();

    const navigation = [
        { name: 'Produtos', href: '/products' },
        { name: 'Categorias', href: '/categories' },
        { name: 'Ofertas', href: '/deals' },
        { name: 'Contato', href: '/contact' }
    ];

    return (
        <header className="bg-white shadow-lg border-b sticky top-0 z-50">
            {/* Top Bar - Informações */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <span>📞 (11) 99999-9999</span>
                            <span>✉️ contato@loja.com</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <span>🚚 Frete grátis acima de R$ 100</span>
                            <span>🔒 Compra 100% segura</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/products" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">L</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Loja Online
                            </h1>
                            <p className="text-xs text-gray-500">Sua loja de confiança</p>
                        </div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:block flex-1 max-w-2xl mx-8">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Buscar produtos, marcas..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Carrinho - só aparece se estiver logado */}
                        {user && (
                            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                                <ShoppingCartIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                                )}
                                {/* Tooltip com valor total */}
                                {totalItems > 0 && (
                                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        <p className="text-sm text-gray-600">
                                            {totalItems} {totalItems === 1 ? 'item' : 'itens'} • {formatPrice(totalValue)}
                                        </p>
                                    </div>
                                )}
                            </Link>
                        )}

                        {/* User Menu ou Login */}
                        {user ? (
                            <UserMenu user={user} isAdmin={isAdmin} />
                        ) : (
                            <div className="hidden sm:flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        Entrar
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Cadastrar</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Bars3Icon className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Search Bar - Mobile */}
                <div className="lg:hidden mt-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar produtos..."
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:block bg-gray-50 border-t">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-8 py-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                        {/* Aba Admin - só aparece para administradores */}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors bg-purple-50 px-3 py-1 rounded-lg"
                            >
                                <CogIcon className="w-4 h-4 mr-2" />
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navigation={navigation}
                user={user}
                isAdmin={isAdmin}
            />
        </header>
    );
}