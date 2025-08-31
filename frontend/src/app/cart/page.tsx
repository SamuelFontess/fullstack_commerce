'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/components/CartItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { formatPrice } from '@/lib/utils';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CartPage() {
    const { items, totalItems, totalValue, clearCart, isCartAccessible } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/cart');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Loading text="Carregando carrinho..." />
            </div>
        );
    }

    if (!user || !isCartAccessible) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
                    <p className="text-gray-600 mb-4">Você precisa estar logado para acessar o carrinho.</p>
                    <Link href="/login?redirect=/cart">
                        <Button>Fazer Login</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    icon={ShoppingCartIcon}
                    title="Seu carrinho está vazio"
                    description="Adicione produtos ao seu carrinho para continuar com a compra."
                    action={
                        <Link href="/products">
                            <Button>Ver Produtos</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* lista de Itens */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">
                                    Itens ({totalItems})
                                </h2>
                                <Button
                                    size="sm"
                                    onClick={clearCart}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Limpar Carrinho
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* resumo do Pedido */}
                <div>
                    <Card className="sticky top-4">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({totalItems} itens)</span>
                                    <span className="font-medium">{formatPrice(totalValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frete</span>
                                    <span className="font-medium text-green-600">Grátis</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-lg font-bold text-green-600">
                      {formatPrice(totalValue)}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/checkout">
                                    <Button className="w-full" size="lg">
                                        Finalizar Compra
                                    </Button>
                                </Link>

                                <Link href="/products">
                                    <Button variant="outline" className="w-full">
                                        Continuar Comprando
                                    </Button>
                                </Link>
                            </div>

                            {/* informações Adicionais */}
                            <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                                <div className="flex items-center mb-2">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Frete grátis para todo o Brasil
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Compra 100% segura
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Garantia de 30 dias
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}