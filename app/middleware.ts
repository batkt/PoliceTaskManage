import { TOKEN_KEY } from '@/lib/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get(TOKEN_KEY)?.value;
    const url = request.nextUrl.pathname;

    const isProtectedRoute = url.startsWith('/dashboard');
    const isPublicRoute = publicRoutes.includes(url);

    // Нэвтрээгүй үед
    if (isProtectedRoute && !token) {
        // Нэвтрэх хуудас руу үсэргэнэ
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Нэвтэрсэн үед нэвтрэх хуудас руу орох гэж оролдвол dashboard руу үсэргэнэ
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
};