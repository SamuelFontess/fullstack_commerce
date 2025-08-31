'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/orderService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CheckoutSummary } from '@/components/CheckoutSummary';
import { PaymentMethod } from '@/components/PaymentMethod';
import { useToast } from '@/hooks/useToast';

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil'
    });

    const { user } = useAuth();
    const { items, totalValue, clearCart } = useCart();
    const { addToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login?redirect=/checkout');
            return;
        }

        if (items.length === 0) {
            router.push('/cart');
            return;
        }
    }, [user, items, router]);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || items.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const order = await orderService.create(orderData);

            addToast({
                type: 'success',
                title: 'Pedido Realizado!',
                message: `Seu pedido #${order.id} foi criado com sucesso.`
            });

            clearCart();
            router.push(`/orders/${order.id}`);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao processar pedido. Tente novamente.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user || items.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

            <form onSubmit={handleSubmitOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário de Checkout */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações de Entrega */}
                        <Card>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Endereço Completo"
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                                            placeholder="Rua, número, complemento"
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="Cidade"
                                        value={shippingData.city}
                                        onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                                        placeholder="Cidade"
                                        required
                                    />
                                    <Input
                                        label="Estado"
                                        value={shippingData.state}
                                        onChange={(e) => setShippingData(prev => ({ ...prev, state: e.target.value }))}
                                        placeholder="Estado"
                                        required
                                    />
                                    <Input
                                        label="CEP"
                                        value={shippingData.zipCode}
                                        onChange={(e) => setShippingData(prev => ({ ...prev, zipCode: e.target.value }))}
                                        placeholder="00000-000"
                                        required
                                    />
                                    <Input
                                        label="País"
                                        value={shippingData.country}
                                        onChange={(e) => setShippingData(prev => ({ ...prev, country: e.target.value }))}
                                        placeholder="País"
                                        required
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Método de Pagamento */}
                        <Card>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
                                <PaymentMethod
                                    selected={paymentMethod}
                                    onChange={setPaymentMethod}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Resumo do Pedido */}
                    <div>
                        <CheckoutSummary
                            items={items}
                            total={totalValue}
                            onSubmit={handleSubmitOrder}
                            loading={loading}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}