import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token');
    const { pathname } = request.nextUrl;

    // Rotas que requerem autenticação
    const protectedRoutes = ['/cart', '/checkout', '/orders', '/profile', '/settings'];

    // Rotas que requerem role ADMIN
    const adminRoutes = ['/admin'];

    // Verificar se a rota requer autenticação
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // Se é rota protegida e não tem token, redirecionar para login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Se é rota admin e não tem token, redirecionar para login
    if (isAdminRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // TODO: Verificar role ADMIN para rotas administrativas
    // Isso requereria decodificar o JWT no middleware ou fazer uma verificação adicional

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/cart/:path*',
        '/checkout/:path*',
        '/orders/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/admin/:path*'
    ]
};