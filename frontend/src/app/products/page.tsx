'use client';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
    const { products, loading, error } = useProducts();

    if (loading) {
        return <div className="text-center">Carregando produtos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Produtos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}