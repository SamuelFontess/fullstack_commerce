'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Order {
    id: number;
    customerName: string;
    total: number;
    status: string;
}

export default function OrdersPage() {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user) {
            api.get<Order[]>('/orders')
                .then(res => setOrders(res.data))
                .catch(err => setError('Erro ao carregar pedidos'));
        }
    }, [loading, user]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
            <ul className="space-y-2">
                {orders.map(order => (
                    <li key={order.id} className="border p-4 rounded flex justify-between">
                        <span>Pedido #{order.id} - {order.customerName}</span>
                        <span>Total: R$ {order.total}</span>
                        <Link href={`/orders/${order.id}`} className="text-blue-500">Detalhes</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}