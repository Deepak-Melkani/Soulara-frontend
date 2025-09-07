import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact'
]

// Define auth routes (should redirect to home if already authenticated)
const authRoutes = ['/login', '/signup']

// Define private routes that require authentication
const privateRoutes = [
  '/profile',
  '/find-match', 
  '/admin',
  '/chat',
  '/chat/*'
]

// Define private route patterns
const privateRoutePatterns = [
  /^\/profile(\?.*)?$/,   // /profile and /profile?query 
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
  
  // Consider authenticated if we have both auth token and user ID
  const hasValidAuth = !!(authToken && authToken.length > 0 && userId && userId.length > 0)
  
  return hasValidAuth
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isUserAuthenticated = isAuthenticated(request)
  
  // Handle auth routes (login, signup) - redirect to home if already authenticated
  if (isAuthRoute(pathname)) {
    if (isUserAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
  
  // Handle public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }
  
  // Handle private routes
  if (isPrivateRoute(pathname)) {
    if (!isUserAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }
  
  // For any other routes, allow access (treat as public by default)
  return NextResponse.next()
}

// Configure which routes the middleware should run on
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