'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export function Sidebar() {
    const { user, isAdmin } = useAuth();
    const pathname = usePathname();

    const adminLinks = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/products', label: 'Produtos', icon: '📦' },
        { href: '/admin/orders', label: 'Pedidos', icon: '📋' },
        { href: '/admin/users', label: 'Usuários', icon: '👥' },
    ];

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Administração
                </h2>

                <nav className="space-y-1">
                    {adminLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                                pathname === link.href
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}