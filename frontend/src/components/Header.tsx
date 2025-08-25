'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';

export function Header() {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems } = useCart();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        Loja
                    </Link>

                    <nav className="flex items-center space-x-6">
                        <Link href="/products" className="text-gray-600 hover:text-gray-900">
                            Produtos
                        </Link>

                        {user ? (
                            <>
                                <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                                    Pedidos
                                </Link>

                                {isAdmin && (
                                    <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                                        Admin
                                    </Link>
                                )}

                                <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
                                    Carrinho
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                                    )}
                                </Link>

                                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Olá, {user.firstName}
                  </span>
                                    <Button variant="secondary" size="sm" onClick={logout}>
                                        Sair
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button size="sm">Entrar</Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}