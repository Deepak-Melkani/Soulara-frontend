import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact'
]

const authRoutes = ['/login', '/signup']

const privateRoutes = [
  '/profile',
  '/find-match', 
  '/admin',
  '/chat',
  '/chat/*'
]

const privateRoutePatterns = [
  /^\/profile(\?.*)?$/,   
  /^\/profile\/.*$/,      // All profile subroutes
  /^\/dashboard\/.*$/,    // All dashboard routes
  /^\/admin\/.*$/,        // All admin routes
  /^\/chat\/.*$/,         // All chat routes
]

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) {
    return true
  }
  return false
}

function isPrivateRoute(pathname: string): boolean {
  if (privateRoutes.includes(pathname)) {
    return true
  }

  return privateRoutePatterns.some(pattern => pattern.test(pathname))
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.includes(pathname)
}

function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('authToken')?.value
  const userId = request.cookies.get('userId')?.value
  
  const hasValidAuth = !!(authToken && authToken.length > 0 && userId && userId.length > 0)
  
  return hasValidAuth
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isUserAuthenticated = isAuthenticated(request)
  
  if (isAuthRoute(pathname)) {
    if (isUserAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
  
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }
  
  if (isPrivateRoute(pathname)) {
    if (!isUserAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}