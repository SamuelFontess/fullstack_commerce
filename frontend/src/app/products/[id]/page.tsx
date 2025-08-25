'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/lib/types';
import { api } from '@/lib/api';
import { OrderSummary } from '@/components/OrderSummary';

export default function OrderDetailPage() {
    const params = useParams();
    const id = Number(params.id);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await api.get<Order>(`/orders/${id}`);
                setOrder(response.data);
            } catch (err) {
                setError('Pedido não encontrado');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }

    if (error || !order) {
        return <div className="text-center text-red-600">Pedido não encontrado</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <OrderSummary order={order} />
        </div>
    );
}