'use client';
import { CartItem } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface CheckoutSummaryProps {
    items: CartItem[];
    total: number;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export function CheckoutSummary({ items, total, onSubmit, loading }: CheckoutSummaryProps) {
    return (
        <Card className="sticky top-4">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

                {/* Lista de Itens */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.imgUrl}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.quantity}x {formatPrice(item.price)}
                                </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Totais */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Frete</span>
                        <span className="font-medium text-green-600">Grátis</span>
                    </div>
                    <div className="border-t pt-3">
                        <div className="flex justify-between">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-lg font-bold text-green-600">
                {formatPrice(total)}
              </span>
                        </div>
                    </div>
                </div>

                {/* Botão de Finalizar */}
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={loading}
                    onClick={onSubmit}
                >
                    {loading ? 'Processando...' : 'Finalizar Pedido'}
                </Button>

                {/* Informações de Segurança */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-600 text-center">
                    <p>🔒 Compra 100% segura e protegida</p>
                </div>
            </div>
        </Card>
    );
}