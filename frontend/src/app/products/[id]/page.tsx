'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { productService } from '@/services/productService';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';
import { formatPrice } from '@/lib/utils';
import {
    ShoppingCartIcon,
    ArrowLeftIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailsPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { canManageProducts } = usePermissions();
    const { addItem } = useCart();
    const { addToast } = useToast();

    const productId = parseInt(params.id as string);

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const productData = await productService.getById(productId);
            setProduct(productData);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Produto não encontrado'
            });
            router.push('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            router.push(`/login?redirect=/products/${productId}`);
            return;
        }

        if (product) {
            for (let i = 0; i < quantity; i++) {
                addItem(product);
            }

            addToast({
                type: 'success',
                title: 'Produto adicionado',
                message: `${quantity}x ${product.name} adicionado ao carrinho`
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Loading text="Carregando produto..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Produto não encontrado</h2>
                    <Link href="/products">
                        <Button>Voltar aos Produtos</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <Link href="/products" className="hover:text-blue-600">
                    Produtos
                </Link>
                <span>/</span>
                <span className="text-gray-900">{product.name}</span>
            </div>

            {/* Botão Voltar */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/products">
                    <Button size="sm">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Voltar aos Produtos
                    </Button>
                </Link>

                {/* Botão Admin - só aparece para administradores */}
                {canManageProducts() && (
                    <Link href={`/admin/products?edit=${product.id}`}>
                        <Button variant="outline" size="sm">
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Editar Produto
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Imagem do Produto */}
                <div className="space-y-4">
                    <div className="aspect-square relative overflow-hidden rounded-2xl">
                        <Image
                            src={product.imgUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Informações do Produto */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.categories.map((category) => (
                                <Badge key={category.id} variant="info">
                                    {category.name}
                                </Badge>
                            ))}
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Preço */}
                    <div className="border-t border-b py-6">
                        <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
                        </div>
                    </div>

                    {/* Controles de Compra */}
                    <div className="space-y-4">
                        {user ? (
                            <>
                                {/* Controle de Quantidade */}
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-gray-700">
                                        Quantidade:
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex space-x-4">
                                    <Button
                                        size="lg"
                                        className="flex-1"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                        Adicionar ao Carrinho
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => {
                                            handleAddToCart();
                                            router.push('/cart');
                                        }}
                                    >
                                        Comprar Agora
                                    </Button>
                                </div>
                            </>
                        ) : (
                            /* Mensagem para usuários não logados */
                            <Card className="p-6 text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Faça login para comprar
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Entre na sua conta para adicionar este produto ao carrinho.
                                </p>
                                <Link href={`/login?redirect=/products/${productId}`}>
                                    <Button size="lg">
                                        Fazer Login
                                    </Button>
                                </Link>
                            </Card>
                        )}
                    </div>

                    {/* Informações Adicionais */}
                    <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                        <div className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Frete grátis para todo o Brasil
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Garantia de 30 dias
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Compra 100% segura
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}