import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product);
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative">
                    <Image
                        src={product.imgUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>

                    <Button size="sm" onClick={handleAddToCart}>
                        Adicionar
                    </Button>
                </div>
            </div>
        </Card>
    );
}