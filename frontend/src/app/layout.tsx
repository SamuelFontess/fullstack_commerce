import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/hooks/useToast'
import { CartProvider } from '@/contexts/CartContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'E-commerce',
    description: 'Sua loja online',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
        <body className={inter.className}>
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
        </body>
        </html>
    )
}