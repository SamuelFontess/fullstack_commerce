import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    products: Product[];
}

export function ProductList({ products }: ProductListProps) {
    if (products.length === 0) {
        return (
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}