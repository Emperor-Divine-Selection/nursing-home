import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('session_id')
  const isAuthPage = req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/register'
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  // 如果在 dashboard 但没有 session，跳转到登录页
  if (isDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 如果在登录/注册页但有 session，跳转到 dashboard
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/', '/register']
}