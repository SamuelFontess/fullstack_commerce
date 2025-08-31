'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { CubeIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('name');

    const { user } = useAuth();
    const { products, loading, error, totalPages } = useProducts({
        page: currentPage - 1,
        size: 12,
        name: searchTerm,
        sort: sortBy
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Loading text="Carregando produtos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    icon={CubeIcon}
                    title="Erro ao carregar produtos"
                    description={error}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header da Página */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Nossos Produtos
                            </h1>
                            <p className="text-gray-600">
                                Descubra nossa seleção de produtos de qualidade
                            </p>
                        </div>

                        <div className="flex-1 max-w-md">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Buscar produtos..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Controles */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-600">
                        {products.length} produtos encontrados
                    </p>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="name">Nome A-Z</option>
                        <option value="name,desc">Nome Z-A</option>
                        <option value="price">Menor Preço</option>
                        <option value="price,desc">Maior Preço</option>
                    </select>
                </div>

                {/* Grid de Produtos */}
                {products.length === 0 ? (
                    <EmptyState
                        icon={CubeIcon}
                        title="Nenhum produto encontrado"
                        description="Tente ajustar os filtros de busca."
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    showAddToCart={!!user}
                                />
                            ))}
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}

                {/* Mensagem para usuários não logados */}
                {!user && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">
                            Faça login para comprar
                        </h3>
                        <p className="text-blue-700 mb-4">
                            Entre na sua conta para adicionar produtos ao carrinho e finalizar compras.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Fazer Login
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}