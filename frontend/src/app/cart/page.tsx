'use client';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Carrinho</h1>
                <p className="text-gray-600">Seu carrinho está vazio</p>
            </div>
        );
    }

    const handleCheckout = () => {
        // Implementar lógica de checkout
        alert('Funcionalidade de checkout em desenvolvimento');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Carrinho</h1>
                <Button variant="danger" onClick={clearCart}>
                    Limpar Carrinho
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <Card key={item.product.id} className="flex items-center space-x-4">
                            <div className="w-20 h-20 relative">
                                <Image
                                    src={item.product.imgUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-gray-600">{formatPrice(item.product.price)}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                >
                                    +
                                </Button>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => removeItem(item.product.id)}
                                >
                                    Remover
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="h-fit">
                    <h3 className="text-xl font-semibold mb-4">Resumo</h3>

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                    </div>

                    <Button className="w-full" onClick={handleCheckout}>
                        Finalizar Compra
                    </Button>
                </Card>
            </div>
        </div>
    );
}