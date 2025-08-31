'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';
import {
    ShoppingCartIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addItem } = useCart();
    const { addToast } = useToast();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem(product);
        addToast({
            type: 'success',
            title: 'Produto adicionado',
            message: `${product.name} foi adicionado ao carrinho`
        });
    };

    return (
        <Card
            variant="elevated"
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                    <Image
                        src={product.imgUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Quick Actions - só aparece se estiver logado */}
                    {showAddToCart && (
                        <div className={`absolute bottom-2 left-2 right-2 flex space-x-2 transition-all duration-300 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-white/90 hover:bg-white"
                            >
                                <EyeIcon className="w-4 h-4 mr-1" />
                                Ver
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCartIcon className="w-4 h-4 mr-1" />
                                Adicionar
                            </Button>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-1">
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

                    {/* Botão de adicionar - só aparece se estiver logado */}
                    {showAddToCart && (
                        <Button size="sm" onClick={handleAddToCart}>
                            Adicionar
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}