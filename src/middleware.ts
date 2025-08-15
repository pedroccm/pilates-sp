import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Apenas proteger rotas /admin, exceto /admin/login e APIs
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login') && 
      !pathname.startsWith('/api/admin/auth')) {
    
    // Verificar se tem o cookie de autenticação
    const authCookie = request.cookies.get('admin-auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirecionar para login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}