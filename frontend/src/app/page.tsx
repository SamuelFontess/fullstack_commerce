'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingBagIcon,
    StarIcon,
    TruckIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    ArrowRightIcon,
    HeartIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { productService } from '@/services/productService';
import { Product } from '@/lib/types';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const response = await productService.getAll({ page: 0, size: 8 });
            setFeaturedProducts(response.content);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = (productId: number) => {
        const newWishlist = new Set(wishlist);
        if (newWishlist.has(productId)) {
            newWishlist.delete(productId);
        } else {
            newWishlist.add(productId);
        }
        setWishlist(newWishlist);
    };

    const features = [
        {
            icon: TruckIcon,
            title: 'Entrega Rápida',
            description: 'Entrega gratuita em pedidos acima de R$ 99',
            color: 'text-primary-600'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Compra Segura',
            description: 'Seus dados protegidos com criptografia SSL',
            color: 'text-success-600'
        },
        {
            icon: CreditCardIcon,
            title: 'Pagamento Fácil',
            description: 'Parcele em até 12x sem juros no cartão',
            color: 'text-accent-600'
        }
    ];

    const categories = [
        { name: 'Eletrônicos', image: '/categories/electronics.jpg', count: 150 },
        { name: 'Roupas', image: '/categories/clothing.jpg', count: 320 },
        { name: 'Casa & Jardim', image: '/categories/home.jpg', count: 89 },
        { name: 'Esportes', image: '/categories/sports.jpg', count: 67 },
        { name: 'Livros', image: '/categories/books.jpg', count: 234 },
        { name: 'Beleza', image: '/categories/beauty.jpg', count: 156 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                                    Descubra o Melhor em
                                    <span className="block text-accent-300">E-commerce</span>
                                </h1>
                                <p className="text-xl lg:text-2xl text-primary-100 max-w-lg">
                                    Produtos de qualidade, preços incríveis e entrega rápida.
                                    Sua experiência de compra nunca foi tão especial.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg font-semibold shadow-strong"
                                >
                                    <ShoppingBagIcon className="w-6 h-6 mr-2" />
                                    Explorar Produtos
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
                                >
                                    Ver Ofertas
                                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            <div className="flex items-center space-x-8 pt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">10k+</div>
                                    <div className="text-primary-200">Produtos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">50k+</div>
                                    <div className="text-primary-200">Clientes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">4.9</div>
                                    <div className="flex items-center justify-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-fade-in">
                            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="bg-white/20 rounded-2xl p-4 animate-bounce-subtle" style={{ animationDelay: `${i * 0.2}s` }}>
                                            <div className="w-full h-24 bg-white/30 rounded-xl mb-3"></div>
                                            <div className="h-3 bg-white/40 rounded mb-2"></div>
                                            <div className="h-2 bg-white/30 rounded w-2/3"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 mb-4 group-hover:shadow-medium transition-shadow ${feature.color}`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                                <p className="text-neutral-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
                            Explore Nossas Categorias
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Encontre exatamente o que você procura em nossas categorias cuidadosamente organizadas
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category, index) => (
                            <Link key={index} href={`/products?category=${category.name.toLowerCase()}`}>
                                <Card className="group cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                    <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                            <span className="text-4xl">{index === 0 ? '📱' : index === 1 ? '👕' : index === 2 ? '🏠' : index === 3 ? '⚽' : index === 4 ? '📚' : '💄'}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-neutral-500">{category.count} produtos</p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
                                Produtos em Destaque
                            </h2>
                            <p className="text-xl text-neutral-600">
                                Selecionados especialmente para você
                            </p>
                        </div>
                        <Link href="/products">
                            <Button variant="outline" size="lg" className="hidden md:flex">
                                Ver Todos
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="aspect-square bg-neutral-200 rounded-t-xl"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-neutral-200 rounded"></div>
                                        <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                                        <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <Card key={product.id} className="group cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                    <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                                            <span className="text-6xl opacity-50">📦</span>
                                        </div>

                                        {/* Overlay with actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                                            <Button size="sm" className="bg-white text-neutral-900 hover:bg-neutral-100">
                                                <EyeIcon className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-white text-white hover:bg-white hover:text-neutral-900"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(product.id);
                                                }}
                                            >
                                                {wishlist.has(product.id) ? (
                                                    <HeartSolidIcon className="w-4 h-4 text-error-500" />
                                                ) : (
                                                    <HeartIcon className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                                                ))}
                                            </div>
                                            <span className="text-sm text-neutral-500 ml-2">(4.5)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                        <span className="text-2xl font-bold text-primary-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                                            </div>
                                            <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                                                <ShoppingBagIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12 md:hidden">
                        <Link href="/products">
                            <Button size="lg" variant="outline">
                                Ver Todos os Produtos
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                            Fique por Dentro das Novidades
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Receba ofertas exclusivas, lançamentos e dicas especiais diretamente no seu e-mail
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex-1 px-4 py-3 rounded-xl text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                            />
                            <Button className="bg-accent-500 hover:bg-accent-600 px-8 py-3 font-semibold">
                                Inscrever-se
                            </Button>
                        </div>

                        <p className="text-sm text-primary-200 mt-4">
                            Não enviamos spam. Cancele a qualquer momento.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}