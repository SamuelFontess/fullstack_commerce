'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { orderService } from '@/services/orderService';
import { Order } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderCard } from '@/components/OrderCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { useToast } from '@/hooks/useToast';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    const { user } = useAuth();
    const { canCreateOrder } = usePermissions();
    const { addToast } = useToast();

    useEffect(() => {
        if (user && canCreateOrder()) {
            loadOrders();
        }
    }, [user, canCreateOrder]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            // Assumindo que existe um endpoint para buscar pedidos do usuário logado
            const response = await orderService.getMyOrders();
            setOrders(response);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao carregar pedidos'
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    const orderStatusOptions = [
        { value: 'all', label: 'Todos', count: orders.length },
        { value: 'WAITING_PAYMENT', label: 'Aguardando Pagamento', count: orders.filter(o => o.status === 'WAITING_PAYMENT').length },
        { value: 'PAID', label: 'Pago', count: orders.filter(o => o.status === 'PAID').length },
        { value: 'SHIPPED', label: 'Enviado', count: orders.filter(o => o.status === 'SHIPPED').length },
        { value: 'DELIVERED', label: 'Entregue', count: orders.filter(o => o.status === 'DELIVERED').length },
        { value: 'CANCELED', label: 'Cancelado', count: orders.filter(o => o.status === 'CANCELED').length }
    ];

    if (!user || !canCreateOrder()) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
                    <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus pedidos.</p>
                    <Link href="/login">
                        <Button>Fazer Login</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Loading text="Carregando seus pedidos..." />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
                    <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
                </div>
                <Link href="/products">
                    <Button>
                        <ShoppingBagIcon className="w-5 h-5 mr-2" />
                        Continuar Comprando
                    </Button>
                </Link>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
                <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                        {orderStatusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilter(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === option.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {option.label}
                                {option.count > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {option.count}
                  </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Lista de Pedidos */}
            {filteredOrders.length === 0 ? (
                <EmptyState
                    icon={ShoppingBagIcon}
                    title="Nenhum pedido encontrado"
                    description={filter === 'all'
                        ? "Você ainda não fez nenhum pedido. Que tal começar a explorar nossos produtos?"
                        : `Nenhum pedido encontrado com o status "${orderStatusOptions.find(o => o.value === filter)?.label}".`
                    }
                    action={
                        <Link href="/products">
                            <Button>Ver Produtos</Button>
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}