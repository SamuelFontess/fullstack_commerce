'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    CubeIcon,
    ShoppingBagIcon,
    UsersIcon,
    ChartBarIcon,
    HomeIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Produtos', href: '/admin/products', icon: CubeIcon },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Usuários', href: '/admin/users', icon: UsersIcon },
    { name: 'Relatórios', href: '/admin/reports', icon: ChartBarIcon },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>

            <nav className="mt-6">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-gray-800 text-white border-r-2 border-blue-500'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}