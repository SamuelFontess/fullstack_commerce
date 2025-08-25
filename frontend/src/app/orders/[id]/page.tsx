'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
    id: number;
    customerName: string;
    total: number;
    status: string;
    items: { productName: string; quantity: number; price: number }[];
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user && id) {
            api.get<Order>(`/orders/${id}`)
                .then(res => setOrder(res.data))
                .catch(err => setError('Erro ao carregar pedido'));
        }
    }, [loading, user, id]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;
    if (!order) return <p>Pedido não encontrado</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Pedido #{order.id}</h1>
            <p><strong>Cliente:</strong> {order.customerName}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> R$ {order.total}</p>

            <h2 className="text-xl font-semibold mt-4 mb-2">Itens</h2>
            <ul className="space-y-1">
                {order.items.map((item, idx) => (
                    <li key={idx} className="border p-2 rounded flex justify-between">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>R$ {item.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}