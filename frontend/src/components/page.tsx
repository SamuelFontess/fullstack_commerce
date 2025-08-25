'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, PageResponse } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { OrderCard } from '@/components/OrderCard';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get<PageResponse<Order>>('/orders');
                setOrders(response.data.content);
            } catch (err) {
                setError('Erro ao carregar pedidos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (loading) {
        return <div className="text-center">Carregando pedidos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                        Você ainda não fez nenhum pedido
                    </p>
                    <Link
                        href="/products"
                        className="text-blue-600 hover:underline"
                    >
                        Ver produtos disponíveis
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <Link key={order.id} href={`/orders/${order.id}`}>
                            <OrderCard order={order} onClick={() => {}} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}