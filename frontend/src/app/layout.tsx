import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/Header';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
        <body>
        <AuthProvider>
            <CartProvider>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                </div>
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    );
}