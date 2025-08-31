'use client';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(item.id);
        } else {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <Link href={`/products/${item.id}`} className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                        src={item.imgUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                </div>
            </Link>

            <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate">
                        {item.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                </p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                    {formatPrice(item.price)}
                </p>
            </div>

            <div className="flex items-center space-x-3">
                {/* Controle de Quantidade */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                        size="sm"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                    >
                        <MinusIcon className="w-4 h-4" />
                    </Button>

                    <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
            {item.quantity}
          </span>

                    <Button
                        size="sm"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </Button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[5rem]">
                    <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                    </p>
                </div>

                {/* Remover Item */}
                <Button
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}