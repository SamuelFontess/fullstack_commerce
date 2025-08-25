'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, PageResponse } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sidebar } from '@/components/Sidebar';

export default function AdminProductsPage() {
    const { isAdmin } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get<PageResponse<Product>>('/products?size=100');
                setProducts(response.data.content);
            } catch (err) {
                setError('Erro ao carregar produtos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchProducts();
        }
    }, [isAdmin]);

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(current => current.filter(p => p.id !== id));
        } catch (error) {
            alert('Erro ao excluir produto');
            console.error(error);
        }
    };

    if (!isAdmin) {
        return (
            <div className="text-center text-red-600">
                Acesso negado.
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
                    <Link href="/admin/products/new">
                        <Button>Adicionar Produto</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center">Carregando produtos...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {products.map(product => (
                            <Card key={product.id} className="flex items-center space-x-4">
                                <img
                                    src={product.imgUrl}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-1">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {product.categories.map(category => (
                                            <span
                                                key={category.id}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                            >
                        {category.name}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-lg font-bold text-green-600 mb-2">
                                        {formatPrice(product.price)}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button size="sm" variant="secondary">
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}